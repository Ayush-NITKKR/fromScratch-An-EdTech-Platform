const IconBtn =({
    text,
    onClick,
    childern,
    disabled,
    outline=false,
    customClasses,
    type
})=>{
    return(
        <button
        onClick={onClick}>
            {
                childern ? (
                    <>
                    <span>
                        {text}
                    </span>
                    {childern}
                    </>
                ): (text)
            }
        </button>
    )
}
export default IconBtn;