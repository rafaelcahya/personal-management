import Anthropic from '@anthropic-ai/sdk'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

const TOOLS = [
  {
    name: 'search_product',
    description:
      "Search for a product in the user's inventory by name. Always call this first to get the product ID before logging usage or adding stock.",
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: "Product name to search for (e.g. 'sabun mandi', 'shampoo', 'pasta gigi')",
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'log_product_usage',
    description:
      "Record that a product was used or ran out. Use when user says 'habis', 'abis', 'dipakai', 'used', 'ran out'. Logs to product_history and decrements quantity.",
    input_schema: {
      type: 'object',
      properties: {
        product_list_id: {
          type: 'string',
          description: 'Product ID from product_list',
        },
        usage_quantity: {
          type: 'number',
          description: "Units used. Use the product's current quantity if it ran out completely.",
        },
        usage_date: {
          type: 'string',
          description: 'Usage date in YYYY-MM-DD format. Default to today.',
        },
        note: { type: 'string', description: 'Optional note' },
      },
      required: ['product_list_id', 'usage_quantity', 'usage_date'],
    },
  },
  {
    name: 'add_product_stock',
    description:
      "Add new stock to a product. Use when user says 'beli', 'tambah', 'bought', 'restocked'. Logs to product_quantity and increments quantity.",
    input_schema: {
      type: 'object',
      properties: {
        product_list_id: {
          type: 'string',
          description: 'Product ID from product_list',
        },
        quantity_added: {
          type: 'number',
          description: 'Units added',
        },
        price: {
          type: 'number',
          description: 'Price paid per unit or total (optional)',
        },
        purchase_date: {
          type: 'string',
          description: 'Purchase date in YYYY-MM-DD format. Default to today.',
        },
        note: { type: 'string', description: 'Optional note' },
      },
      required: ['product_list_id', 'quantity_added', 'purchase_date'],
    },
  },
  {
    name: 'create_product_brand',
    description:
      "Create a new brand in the database. Use when the user mentions a brand that does not exist in the Available Brands list. Returns the new brand's ID.",
    input_schema: {
      type: 'object',
      properties: {
        brand: { type: 'string', description: 'Brand name to create' },
      },
      required: ['brand'],
    },
  },
  {
    name: 'create_product_name',
    description:
      "Create a new product name/type in the database. Use when the product name does not exist in the Available Product Names list. Returns the new product name's ID.",
    input_schema: {
      type: 'object',
      properties: {
        product_name: {
          type: 'string',
          description: "Product name to create (e.g. 'Sabun Mandi', 'Shampoo')",
        },
      },
      required: ['product_name'],
    },
  },
  {
    name: 'create_product_entry',
    description:
      'Create a new product entry in the inventory (product_list). Use after confirming or creating the brand and product name. The resulting ID can then be used with add_product_stock.',
    input_schema: {
      type: 'object',
      properties: {
        product_id: {
          type: 'string',
          description: 'ID from the product_name table',
        },
        brand_id: {
          type: 'string',
          description: 'ID from the product_brand table',
        },
        type: {
          type: 'string',
          description:
            "Product category or type (e.g. 'body wash', 'shampoo', 'toothpaste', 'household')",
        },
        note: { type: 'string', description: 'Optional note' },
      },
      required: ['product_id', 'brand_id', 'type'],
    },
  },
]

async function executeTool(name, input, userId) {
  const supabase = getSupabase()
  if (name === 'search_product') {
    const { data, error } = await supabase
      .from('product_list')
      .select('id,product,brand,type,quantity,usage_quantity,product_status')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .ilike('product', `%${input.query}%`)
      .limit(5)
    if (error) return { error: error.message }
    return { products: data ?? [], count: data?.length ?? 0 }
  }

  if (name === 'log_product_usage') {
    const { product_list_id, usage_quantity, usage_date, note } = input

    const { error: histError } = await supabase.from('product_history').insert({
      user_id: userId,
      product_list_id,
      usage_quantity,
      usage_date,
      note: note || null,
    })
    if (histError) return { error: histError.message }

    const { data: product } = await supabase
      .from('product_list')
      .select('quantity,product')
      .eq('id', product_list_id)
      .eq('user_id', userId)
      .single()

    const newQty = Math.max(0, (product?.quantity ?? 0) - usage_quantity)

    const { error: updateError } = await supabase
      .from('product_list')
      .update({
        quantity: newQty,
        usage_quantity,
        usage_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product_list_id)
      .eq('user_id', userId)
    if (updateError) return { error: updateError.message }

    return {
      success: true,
      product_name: product?.product,
      new_quantity: newQty,
    }
  }

  if (name === 'add_product_stock') {
    const { product_list_id, quantity_added, price, purchase_date, note } = input

    const { error: stockError } = await supabase.from('product_quantity').insert({
      user_id: userId,
      product_list_id,
      quantity_added,
      price: price || null,
      purchase_date,
      note: note || null,
    })
    if (stockError) return { error: stockError.message }

    const { data: product } = await supabase
      .from('product_list')
      .select('quantity,product')
      .eq('id', product_list_id)
      .eq('user_id', userId)
      .single()

    const newQty = (product?.quantity ?? 0) + quantity_added

    const { error: updateError } = await supabase
      .from('product_list')
      .update({
        quantity: newQty,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product_list_id)
      .eq('user_id', userId)
    if (updateError) return { error: updateError.message }

    return {
      success: true,
      product_name: product?.product,
      new_quantity: newQty,
    }
  }

  if (name === 'create_product_brand') {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('product_brand')
      .insert({
        user_id: userId,
        brand: input.brand,
        brand_status: 'active',
        created_at: now,
        updated_at: now,
      })
      .select('id,brand')
      .single()
    if (error) return { error: error.message }
    return { success: true, id: data.id, brand: data.brand }
  }

  if (name === 'create_product_name') {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('product_name')
      .insert({
        user_id: userId,
        product_name: input.product_name,
        product_name_status: 'active',
        created_at: now,
        updated_at: now,
      })
      .select('id,product_name')
      .single()
    if (error) return { error: error.message }
    return { success: true, id: data.id, product_name: data.product_name }
  }

  if (name === 'create_product_entry') {
    const { product_id, brand_id, type, note } = input

    const { data: pn } = await supabase
      .from('product_name')
      .select('product_name')
      .eq('id', product_id)
      .eq('user_id', userId)
      .single()

    const { data: pb } = await supabase
      .from('product_brand')
      .select('brand')
      .eq('id', brand_id)
      .eq('user_id', userId)
      .single()

    if (!pn || !pb) return { error: 'Product name or brand not found' }

    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('product_list')
      .insert({
        user_id: userId,
        product: pn.product_name,
        brand: pb.brand,
        type,
        product_id,
        brand_id,
        product_status: 'inactive',
        quantity: 0,
        usage_quantity: 0,
        product_image: '',
        note: note || '',
        usage_date: null,
        is_favorite: false,
        created_at: now,
        updated_at: now,
      })
      .select('id,product,brand')
      .single()
    if (error) return { error: error.message }
    return {
      success: true,
      id: data.id,
      product: data.product,
      brand: data.brand,
    }
  }

  return { error: `Unknown tool: ${name}` }
}

export async function POST(req) {
  const { messages } = await req.json()

  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const userId = user.id

  const [
    { data: productList },
    { data: productQuantity },
    { data: productHistory },
    { data: productBrand },
    { data: productName },
  ] = await Promise.all([
    supabase
      .from('product_list')
      .select(
        'id,product,type,brand,product_status,quantity,usage_quantity,usage_date,note,is_favorite'
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('product_quantity')
      .select('product_list_id,quantity_added,price,purchase_date,note')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('product_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('product_brand').select('id,brand,brand_status').eq('user_id', userId).limit(200),
    supabase
      .from('product_name')
      .select('id,product_name,product_name_status')
      .eq('user_id', userId)
      .limit(200),
  ])

  const today = new Date().toISOString().split('T')[0]

  const systemPrompt = `You are an AI assistant for a Product Tracking app. You help users track household products (soap, shampoo, etc.) and can directly update the database using tools.

Today's date: ${today}

## Your Tools:
- **search_product**: Find a product in product_list by name → get its ID and current stock
- **log_product_usage**: Record usage when product is used/runs out → decrements stock
- **add_product_stock**: Add new stock when product is bought → increments stock
- **create_product_brand**: Create a new brand if it doesn't exist yet
- **create_product_name**: Create a new product name/type if it doesn't exist yet
- **create_product_entry**: Create a new product entry in the inventory (product_list)

## Decision flow for logging usage or adding stock:
1. Call search_product to find the product in product_list
2. If found → use log_product_usage or add_product_stock with its ID
3. If NOT found → proceed to create it automatically (steps below)

## Decision flow for adding a brand-new product:
1. Check Available Brands list — if the brand doesn't exist, call create_product_brand
2. Check Available Product Names list — if the name doesn't exist, call create_product_name
3. Call create_product_entry with the brand_id and product_id (from existing or newly created records)
4. Call add_product_stock with the new product_list ID to add initial stock

## Language:
- Respond in the same language the user uses (Indonesian or English)
- Be brief and conversational; confirm what you did after each tool use
- Never ask the user to add brands or names manually — handle it yourself with the tools

## Current Product Data:

### Product List (${productList?.length ?? 0} products):
${JSON.stringify(productList)}

### Stock History (${productQuantity?.length ?? 0} records):
${JSON.stringify(productQuantity)}

### Usage History (50 latest records):
${JSON.stringify(productHistory)}

### Available Brands (with IDs):
${JSON.stringify(productBrand)}

### Available Product Names (with IDs):
${JSON.stringify(productName)}

Rules:
- Never fabricate data — only use what is provided
- Alert proactively when quantity <= 2
- Use tables when comparing multiple products`

  const encode = (obj) => new TextEncoder().encode(JSON.stringify(obj) + '\n')

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        let loopMessages = [...messages]
        const MAX_ITERATIONS = 5

        for (let i = 0; i < MAX_ITERATIONS; i++) {
          const stream = await anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: systemPrompt,
            tools: TOOLS,
            messages: loopMessages,
          })

          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(
                encode({
                  type: 'text',
                  chunk: chunk.delta.text,
                })
              )
            }
          }

          const finalMessage = await stream.finalMessage()

          if (finalMessage.stop_reason === 'end_turn') break

          if (finalMessage.stop_reason === 'tool_use') {
            const toolUses = finalMessage.content.filter((c) => c.type === 'tool_use')
            const toolResults = []

            for (const toolUse of toolUses) {
              controller.enqueue(
                encode({
                  type: 'tool',
                  name: toolUse.name,
                  status: 'running',
                })
              )

              const result = await executeTool(toolUse.name, toolUse.input, userId)

              controller.enqueue(
                encode({
                  type: 'tool',
                  name: toolUse.name,
                  status: result.error ? 'error' : 'success',
                  data: result,
                })
              )

              toolResults.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: JSON.stringify(result),
              })
            }

            loopMessages = [
              ...loopMessages,
              {
                role: 'assistant',
                content: finalMessage.content,
              },
              { role: 'user', content: toolResults },
            ]
          }
        }
      } catch (err) {
        const errMessage = err?.message ?? String(err)
        console.error('Chat agentic loop error:', errMessage, err)
        controller.enqueue(
          encode({
            type: 'error',
            message: 'Terjadi kesalahan. Coba lagi.',
            detail: process.env.NODE_ENV === 'development' ? errMessage : undefined,
          })
        )
      }

      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
