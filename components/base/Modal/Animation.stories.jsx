import { useState } from 'react'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/Animation',
}

export default meta

function DurationDemo() {
  const [customMs, setCustomMs] = useState(300)
  const [customOpen, setCustomOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl">
      <span className="text-xs text-gray-400">duration — named presets</span>
      <div className="flex flex-wrap gap-2">
        {[
          { duration: 'fast', label: 'fast — 100ms' },
          { duration: 'default', label: 'default — 200ms' },
          { duration: 'slow', label: 'slow — 400ms' },
          { duration: 'slower', label: 'slower — 700ms' },
        ].map(({ duration, label }) => (
          <Modal key={duration}>
            <ModalTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
              >
                {label}
              </button>
            </ModalTrigger>
            <ModalContent duration={duration}>
              <ModalHeader>
                <ModalTitle>duration="{duration}"</ModalTitle>
                <ModalDescription>
                  {duration === 'fast' && 'Resolves to 100ms.'}
                  {duration === 'default' && 'Resolves to 200ms.'}
                  {duration === 'slow' && 'Resolves to 400ms.'}
                  {duration === 'slower' && 'Resolves to 700ms.'}
                </ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <ModalClose asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Close
                  </button>
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ))}
      </div>

      <span className="text-xs text-gray-400 mt-2">duration — custom integer (ms)</span>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={50}
          max={2000}
          step={50}
          value={customMs}
          onChange={(e) => setCustomMs(Number(e.target.value))}
          className="w-24 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-xs text-gray-400">ms</span>
        <button
          type="button"
          onClick={() => setCustomOpen(true)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
        >
          Open
        </button>
      </div>
      <Modal open={customOpen} onOpenChange={setCustomOpen}>
        <ModalContent duration={customMs}>
          <ModalHeader>
            <ModalTitle>Custom duration: {customMs}ms</ModalTitle>
            <ModalDescription>Animation takes exactly {customMs}ms.</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <button
              type="button"
              onClick={() => setCustomOpen(false)}
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export const Animation = {
  name: 'Animation',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalContent</code> controls
        how the panel enters and exits. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">zoom</code>.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {[
          {
            animation: 'none',
            label: 'none',
            desc: 'No animation — modal appears and disappears instantly. Useful for testing or when motion must be fully disabled.',
          },
          {
            animation: 'zoom',
            label: 'zoom — default',
            desc: 'Scales from 95% to 100% with fade. Best for standard desktop modals.',
          },
          {
            animation: 'fade',
            label: 'fade',
            desc: 'Opacity only, no movement. Subtle and minimal — good when motion should be reduced.',
          },
          {
            animation: 'slide-up',
            label: 'slide-up',
            desc: 'Slides in from below with fade. Feels natural for confirmations and mobile-style sheets.',
          },
          {
            animation: 'slide-down',
            label: 'slide-down',
            desc: 'Slides in from above with fade. Works well for alerts and notifications.',
          },
        ].map(({ animation, label, desc }) => (
          <div key={animation} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">{label}</span>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            <div>
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Open ({animation})
                  </button>
                </ModalTrigger>
                <ModalContent animation={animation}>
                  <ModalHeader>
                    <ModalTitle>Animation: {animation}</ModalTitle>
                    <ModalDescription>{desc}</ModalDescription>
                  </ModalHeader>
                  <ModalFooter>
                    <ModalClose asChild>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                      >
                        Close
                      </button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>
        ))}
      </div>

      <DurationDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* animation variants */}
<ModalContent animation="none">...</ModalContent>
<ModalContent animation="zoom">...</ModalContent>        {/* default */}
<ModalContent animation="fade">...</ModalContent>
<ModalContent animation="slide-up">...</ModalContent>
<ModalContent animation="slide-down">...</ModalContent>

{/* named duration presets */}
<ModalContent duration="fast">...</ModalContent>         {/* 100ms */}
<ModalContent duration="default">...</ModalContent>      {/* 200ms */}
<ModalContent duration="slow">...</ModalContent>         {/* 400ms */}
<ModalContent duration="slower">...</ModalContent>       {/* 700ms */}

{/* custom integer in ms */}
<ModalContent duration={350}>...</ModalContent>

{/* combine — duration ignored when animation="none" */}
<ModalContent animation="slide-up" duration="slow">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}
