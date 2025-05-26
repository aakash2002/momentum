"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

type Props = {
  show: boolean
  onClose?: () => void
}

export default function ScheduleSuccess({ show, onClose }: Props) {
  const router = useRouter()

  const handleClick = () => {
    onClose?.()
    router.push("/tasks")
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center text-center px-6"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <CheckCircle2 className="w-10 h-10 text-green-400 mb-4" />

          <motion.h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your tasks are scheduled!
          </motion.h1>
          <motion.p className="text-lg text-white/80 mb-8">
            Ready to conquer the day?
          </motion.p>

          <Button size="lg" onClick={handleClick}>
            Go to Task View
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
