import { getCharacter } from '../../helper'
import './Board.css'

const Board = () => {
    const ranks = Array(8).fill().map((x,i) => 8-i)
    const files = Array(8).fill().map((x,i) => getCharacter(i))
    return <div className='board'>
        <div className='tiles'>
            {ranks.map((rank,i) =>
                files.map((file,j) =>
                    <div key={file+'-'+rank}>{file}{rank}</div>
                )
            )}
        </div>


    </div>
}

export default Board