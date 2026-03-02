declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      category?: string
    }
  }

  interface User {
    id: string
    category?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    category?: string
  }
}
