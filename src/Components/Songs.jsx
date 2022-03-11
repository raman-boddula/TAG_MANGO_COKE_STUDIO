import React from 'react';
import axios from 'axios';
import {BsPlayCircleFill,BsPauseCircle} from 'react-icons/bs'
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { Select } from 'antd';

export const Songs = () => {
    const [songs, setSongs] = React.useState([]);
    const [curr, setCurr] = React.useState({});
    const [showPlayer, setShowPlayer] = React.useState(false);
    const audioPlayer = React.useRef();
    const { Option } = Select;
    React.useEffect(() => {
        axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/studiod9c0baf.json').then((response) => {
            setSongs(response.data);
        })
    }, [])
    const handlePlay = (song) => {
        setCurr(song);
        if (audioPlayer.current) {
            audioPlayer.current.pause();
            audioPlayer.current.load();
            audioPlayer.current.play();
        }
        setShowPlayer(true)
    }
    const handleFilter = (value) => {
        console.log(value)
        let result=value === 'AtoZ' ? songs.sort((a, b) => a.song.localeCompare(b.song)) : songs.sort((a, b) => b.song.localeCompare(a.song));
        setSongs(result)
        
    }
    return (
        <>
            <h1> CokeStudio Songs </h1>
            <Select style={{width:"10em"}} placeholder="sort by alphabetically" onChange={(value)=>handleFilter(value)}>
                <Option value='AtoZ'>A to Z</Option>
                <Option value='ZtoA'>Z to A</Option>
            </Select>
            <div  style={{display:'grid',gridTemplateColumns:'repeat(3,32%)',gridGap:'1%'}}>
                {songs.map((el) => {
                    return (<div className="prod" onClick={()=>handlePlay(el)}>
                        <img src={el.cover_image} alt={el.song} />
                        <div className="details">
                        <h2>{el.song}</h2>
                        <p>{el.artists}</p>
                       </div>
                    </div>)
                }) }
            </div>
            <br />
           { showPlayer?<div className="myPlayer">
                <div> <img src={curr.cover_image} alt={curr.song} /> </div>
                <div>
                    <div> {curr.song} </div>
                    <div> {curr.artists} </div>
                </div> 
                   <div><img style={{borderRadius:'20%'}} src="https://i.gifer.com/origin/55/554818561cbf36d813ef2010cc9d66cc.gif" alt='musicGif'/></div> 
                <audio ref={audioPlayer}>
                    <source src={curr.url}></source>
                </audio>
                <div className="btns">
                    <BiSkipPrevious onClick={
                        () =>
                        {
                            handlePlay(songs[songs.indexOf(curr) - 1 < 0 ? songs.length - 1 : songs.indexOf(curr) - 1])
                        }
                    } style={{ fontSize: '3em', margin: '10px' }} />
                    <BsPlayCircleFill  onClick={()=>audioPlayer.current.play()} style={{fontSize:'3em', margin:'10px'}} />
                    <BsPauseCircle  onClick={()=>audioPlayer.current.pause()} style={{fontSize:'3em', margin:'10px'}} />
                    < BiSkipNext  onClick={()=>handlePlay(songs[songs.indexOf(curr)+1 >songs.length-1 ? 0 :songs.indexOf(curr)+1])} style={{fontSize:'3em', margin:'10px'}}/>
                </div>

            </div>:null}
        </>
    )
}