import { useAuthStore } from "~/store/auth"
export const useLogoutModal = () => {
  const isOpen = ref(false)
  const authStore = useAuthStore()
  const router = useRouter()

  const openModal = () => {
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
  }

  const handleLogout = async () => {
    try {
      // Call your logout API
       authStore.logout()
      
      // Clear tokens, user data, etc.
      localStorage.removeItem('authToken')
      
      // Redirect to login
      await router.push('/sign-in')
      
      // Show success notification (optional)
      // useToast().success('Logged out successfully')
      
      closeModal()
    } catch (error) {
      console.error('Logout failed:', error)
      // useToast().error('Failed to logout')
    }
  }

  return {
    isOpen,
    openModal,
    closeModal,
    handleLogout,
  }
}