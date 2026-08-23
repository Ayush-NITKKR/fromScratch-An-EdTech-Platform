const Highlightedtxt = ({color , text}) =>{
    return(
        <span className={`${color}`}>
            {text}
        </span>
    )
}
export default Highlightedtxt;