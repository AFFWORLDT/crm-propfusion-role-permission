import { useAuth } from "../context/AuthContext"
import PropTypes from "prop-types"
import { useSearchParams } from "react-router-dom"
import styles from "../styles/BtnAdd.module.css"

const AddAgentIdInParams = ({ buttonName }) => {
    const {currentUser} = useAuth()
    const id = currentUser?.id
    const [searchParams, setSearchParams] = useSearchParams()
  

    const handleClick = () => {
        searchParams.set('agent_id', id)
        setSearchParams(searchParams)
    }
    
    return (
        <div>
            <button className={styles.btnAdd} onClick={handleClick}>
                {buttonName}
            </button>
        </div>
    )
}

AddAgentIdInParams.propTypes = {
    buttonName: PropTypes.string.isRequired
}

export default AddAgentIdInParams
