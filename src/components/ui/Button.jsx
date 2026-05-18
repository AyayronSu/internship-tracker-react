function Button({ children, type = "button", variant = "primary", onClick, disabled, loading, ...props }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-${variant}`}
            {...props}
        />
    );
}

export default Button;