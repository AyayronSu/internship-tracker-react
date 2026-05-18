function FormInput({ label, type = "text", placeholder, value, onChange, required = false, ...props }) {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="form-input"
                {...props}
            />
        </div>
    );
}

export default FormInput;