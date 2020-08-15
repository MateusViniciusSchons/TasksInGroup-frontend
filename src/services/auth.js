export default function isAuthenticated() {
    const userId = localStorage.getItem('userIdTasksSite')
    const userName = localStorage.getItem('userNameTasksSite')

    return userId && userName? true: false
}