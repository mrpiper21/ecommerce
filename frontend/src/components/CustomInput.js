import react from "react";


const CustomInput = (props) => {
    const { type, label, i_id, i_class, name, val, onChng, onBlr } = props
    return (
        <div>
            <input type={type}
                id={i_id}
                placeholder={label}
                name={name} 
                value={val}
                onChange={onChng}
                onBlur={onBlr}
            />
            <label htmlFor={label}>{label}</label>
        </div>
    )
}

export default CustomInput
