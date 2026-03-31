import React, { createContext, useEffect, useState } from 'react'

export const UserDataContext = createContext()

const ContextUser = ({children}) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
      const storedUser =  JSON.parse(localStorage.getItem('user'));

      if(storedUser) {
        setUser(storedUser);
      }
    }, [])
    

  return (
    <div>
      <UserDataContext.Provider value={{user, setUser}}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default ContextUser