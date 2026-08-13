'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  createNode,
  deleteNode,
  getInvestmentFlowTree,
  moveNode,
  updateNode,
  updateUninvestedCash,
  updateHighlights,
  createCashCategory,
  updateCashCategory,
  deleteCashCategory,
} from '@/lib/api/investmentFlow'

function buildTree(flatNodes) {
  const nodeMap = new Map()
  flatNodes.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [] })
  })

  const roots = []
  nodeMap.forEach((node) => {
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      nodeMap.get(node.parent_id).children.push(node)
    } else {
      roots.push(node)
    }
  })

  nodeMap.forEach((node) => {
    node.children.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  })
  roots.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return roots
}

// nominal cascades from leaves upward; percentage is computed relative to the sum of root nominals
// plus uninvested cash, since cash is part of total portfolio value
function withComputedValues(roots, flatNodes, uninvestedCash) {
  function sumNominal(node) {
    if (node.children.length > 0) {
      node.computedNominal = node.children.reduce((sum, child) => sum + sumNominal(child), 0)
    } else {
      node.computedNominal = node.nominal || 0
    }
    return node.computedNominal
  }
  roots.forEach(sumNominal)

  const rootTotal = roots.reduce((sum, node) => sum + node.computedNominal, 0) + uninvestedCash

  function applyPercentage(node) {
    node.percentage = rootTotal > 0 ? (node.computedNominal / rootTotal) * 100 : 0
    node.children.forEach(applyPercentage)
  }
  roots.forEach(applyPercentage)

  // collect computed values once here so consumers never need to re-walk the tree
  const nodeMap = new Map()
  function collectEnriched(nodes) {
    nodes.forEach((n) => {
      nodeMap.set(n.id, { computedNominal: n.computedNominal, percentage: n.percentage })
      if (n.children.length) collectEnriched(n.children)
    })
  }
  collectEnriched(roots)
  const enrichedFlatNodes = flatNodes.map((n) => ({
    ...n,
    ...(nodeMap.get(n.id) ?? { computedNominal: 0, percentage: 0 }),
  }))

  return { roots, rootTotal, enrichedFlatNodes }
}

export function useInvestmentFlow() {
  const [flatNodes, setFlatNodes] = useState([])
  const [uninvestedCash, setUninvestedCash] = useState(0)
  const [cashCategories, setCashCategories] = useState([])
  const [highlights, setHighlights] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const loadTree = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const {
        nodes,
        uninvestedCash: cashValue,
        cashCategories: cats,
        highlights: savedHighlights,
      } = await getInvestmentFlowTree()
      if (!isMounted.current) return
      setFlatNodes(nodes)
      setUninvestedCash(cashValue ?? 0)
      setCashCategories(cats ?? [])
      setHighlights(savedHighlights ?? {})
    } catch (err) {
      if (!isMounted.current) return
      console.error('Failed to load investment flow tree:', err)
      setIsError(true)
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTree()
  }, [loadTree])

  // when categories exist, their sum overrides the manual uninvested cash total
  const effectiveUninvestedCash = useMemo(
    () =>
      cashCategories.length > 0
        ? cashCategories.reduce((sum, c) => sum + (c.nominal || 0), 0)
        : uninvestedCash,
    [cashCategories, uninvestedCash]
  )

  const {
    roots: tree,
    rootTotal,
    enrichedFlatNodes,
  } = useMemo(
    () => withComputedValues(buildTree(flatNodes), flatNodes, effectiveUninvestedCash),
    [flatNodes, effectiveUninvestedCash]
  )

  const handleCreateNode = useCallback(
    async (payload) => {
      try {
        await createNode(payload)
        toast.success(payload.node_type === 'category' ? 'Category added' : 'Ticker added')
        await loadTree()
        return true
      } catch (err) {
        if (err.code === 'INSUFFICIENT_CASH') throw err
        toast.error(err.message || 'Failed to create node')
        return false
      }
    },
    [loadTree]
  )

  const handleUpdateNode = useCallback(
    async (id, payload) => {
      try {
        await updateNode(id, payload)
        toast.success('Node updated')
        await loadTree()
        return true
      } catch (err) {
        if (err.code === 'INSUFFICIENT_CASH') throw err
        toast.error(err.message || 'Failed to update node')
        return false
      }
    },
    [loadTree]
  )

  const handleDeleteNode = useCallback(
    async (id) => {
      try {
        await deleteNode(id)
        toast.success('Node deleted')
        await loadTree()
        return true
      } catch (err) {
        toast.error(err.message || 'Failed to delete node')
        return false
      }
    },
    [loadTree]
  )

  const handleMoveNode = useCallback(
    async (id, newParentId) => {
      try {
        // append to end of target's siblings so the moved node never
        // collides with an existing sort_order (defaulting to 0 caused reorder bugs)
        const siblingOrders = flatNodes
          .filter((node) => node.parent_id === newParentId)
          .map((node) => node.sort_order ?? 0)
        const sortOrder = siblingOrders.length > 0 ? Math.max(...siblingOrders) + 1 : 0

        await moveNode(id, { new_parent_id: newParentId, sort_order: sortOrder })
        toast.success('Node moved')
        await loadTree()
        return true
      } catch (err) {
        toast.error(err.message || 'Failed to move node')
        return false
      }
    },
    [loadTree, flatNodes]
  )

  const handleSaveHighlights = useCallback(async (next) => {
    setHighlights(next)
    try {
      await updateHighlights(next)
    } catch (err) {
      console.error('Failed to save highlights:', err)
    }
  }, [])

  const handleUpdateUninvestedCash = useCallback(async (amount) => {
    try {
      const result = await updateUninvestedCash(amount)
      setUninvestedCash(result)
      toast.success('Uninvested cash updated')
      return true
    } catch (err) {
      toast.error(err.message || 'Failed to update uninvested cash')
      return false
    }
  }, [])

  const handleCreateCashCategory = useCallback(async (payload) => {
    try {
      const category = await createCashCategory(payload)
      setCashCategories((prev) => [...prev, category])
      toast.success('Cash category added')
      return true
    } catch (err) {
      toast.error(err.message || 'Failed to add cash category')
      return false
    }
  }, [])

  const handleUpdateCashCategory = useCallback(async (id, payload) => {
    try {
      const updated = await updateCashCategory(id, payload)
      setCashCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
      toast.success('Cash category updated')
      return true
    } catch (err) {
      toast.error(err.message || 'Failed to update cash category')
      return false
    }
  }, [])

  const handleDeleteCashCategory = useCallback(async (id) => {
    try {
      await deleteCashCategory(id)
      setCashCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Cash category deleted')
      return true
    } catch (err) {
      toast.error(err.message || 'Failed to delete cash category')
      return false
    }
  }, [])

  const categoryOptions = useMemo(() => {
    return flatNodes
      .filter((node) => node.node_type === 'category')
      .map((node) => ({ id: node.id, name: node.name }))
  }, [flatNodes])

  return {
    tree,
    flatNodes,
    enrichedFlatNodes,
    rootTotal,
    uninvestedCash: effectiveUninvestedCash,
    cashCategories,
    highlights,
    isLoading,
    isError,
    reload: loadTree,
    categoryOptions,
    createNode: handleCreateNode,
    updateNode: handleUpdateNode,
    deleteNode: handleDeleteNode,
    moveNode: handleMoveNode,
    updateUninvestedCash: handleUpdateUninvestedCash,
    saveHighlights: handleSaveHighlights,
    createCashCategory: handleCreateCashCategory,
    updateCashCategory: handleUpdateCashCategory,
    deleteCashCategory: handleDeleteCashCategory,
  }
}
