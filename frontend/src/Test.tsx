import { useUser } from "@clerk/clerk-react"

const Test = () => {
    const { user } = useUser()
    const printU = () => console.log("Test===============",user)
  return (
    <div><button onClick={printU}>
        
        Test 
        </button></div>
  )
}

export default Test