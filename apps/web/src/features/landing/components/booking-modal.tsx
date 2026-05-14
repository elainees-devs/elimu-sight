import { useState } from 'react'
import { Modal } from '@shared/components/ui/modal'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'

interface BookingModalProps {
  open: boolean
  onClose: () => void
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setConfirmed(true)
      setTimeout(() => {
        setConfirmed(false)
        setDate('')
        setTime('')
        onClose()
      }, 2500)
    }, 1000)
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule a Demo">
      {confirmed ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Demo Scheduled!</h3>
          <p className="mt-1 text-sm text-gray-600">
            We&apos;ll send a confirmation to your email shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            Select a date and time that works best for you.
          </p>
          <Input
            label="Preferred Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Preferred Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <Button
            className="w-full"
            size="lg"
            onClick={handleConfirm}
            disabled={!date || !time || loading}
          >
            {loading ? 'Scheduling...' : 'Confirm Booking'}
          </Button>
        </div>
      )}
    </Modal>
  )
}
