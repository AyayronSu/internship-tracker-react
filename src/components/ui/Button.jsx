function Button({ 
    children, 
    type = "button", 
    variant = "primary", 
    onClick, 
    disabled, 
    loading, 
    loadingText = "Loading...", 
    ...props 
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-${variant}`}
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    );
}

export default Button;