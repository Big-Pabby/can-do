import { watch } from "vue"
import { toast } from "vue-sonner"
import ProgressToast from "~/pages/components/ProgressToast.vue"
import { UseProgress } from "~/pages/hooks"

let toastId: string | number | undefined

export const startUpload = (jobId: string) => {
  const { data } = UseProgress(jobId)

  watch(
    () => data.value?.progress,
    (newProgress) => {
      if (newProgress == null) return

      if (newProgress < 100) {
        if (!toastId) {
          toastId = toast.custom(() => h(ProgressToast, { progress: newProgress }), {
            duration: Infinity,
          })
        } else {
          toast.custom(() => h(ProgressToast, { progress: newProgress }), {
            id: toastId,
            duration: Infinity,
          })
        }
      } else {
        if (toastId) toast.dismiss(toastId)
        toast.success("Upload complete!", {
          style: {
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#16A34A",
          },
          class: "my-toast",
          descriptionClass: "my-toast-description",
        })
      }
    }
  )
}
