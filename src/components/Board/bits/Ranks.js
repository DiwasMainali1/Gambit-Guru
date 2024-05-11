const Ranks = ({ranks}) => {
    return <div className="ranks">
        {ranks.map(rank => <span>{rank}</span>)}
    </div>
}

export default Ranks