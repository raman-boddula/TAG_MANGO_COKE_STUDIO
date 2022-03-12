import React from 'react';
import axios from 'axios';
import {BsFillGridFill,BsListUl,BsPlayCircleFill,BsPauseCircle} from 'react-icons/bs'
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';

import { Select } from 'antd';

export const Songs = () => {
    const [songs, setSongs] = React.useState([]);
    const [curr, setCurr] = React.useState({});
    const [showPlayer, setShowPlayer] = React.useState(false);
    const audioPlayer = React.useRef();
    const [gridView, setGridView] = React.useState(true);
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
        setSongs([...result])
        console.log(songs)
        
    }
    return (
        <>
            <div className="logoStyle" style={{display: 'flex',justifyContent: 'space-between',padding:"2em"}}>

                <div >
                    <img  width="70px" style={{borderRadius:"50%"}}   src="https://yt3.ggpht.com/ytc/AKedOLTNtHgVmX114S4cnjoyFaDDJE6N1zNBwKgRNnYNAg=s900-c-k-c0x00ffffff-no-rj" alt='logo'/>
            </div>
                <div style={{marginRight:'5em',fontSize:'3em',cursor:"pointer"}}>
                    <BsFillGridFill style={{color:gridView ? "#2FA4FF":"black"}} onClick={() => setGridView(true)}/>
                    &nbsp;<BsListUl style={{color:!gridView ? "#2FA4FF":"black"}} onClick={() => setGridView(false)}/>
                </div>
            </div>
            {gridView?<h2  style={{fontWeight:"bolder"}}>GridView</h2>:<h2 style={{fontWeight:"bolder"}}>ListView</h2>}
            <h5>Sort By Alphabetically</h5>
            <Select style={{width:"10em",marginBottom:'1em'}} placeholder="sort by alphabetically" onChange={(value)=>handleFilter(value)}>
                <Option value='AtoZ'>A to Z</Option>
                <Option value='ZtoA'>Z to A</Option>
            </Select>
            {gridView ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,32%)', gridGap: '1%' }}>
                {songs.map((el) => {
                    return (<div className="prod" onClick={() => handlePlay(el)}>
                        <img src={el.cover_image} alt={el.song} />
                        <div className="details">
                            <h2>{el.song}</h2>
                            <p>{el.artists}</p>
                        </div>
                    </div>)
                })}
            </div> : <div style={{display:"flex",flexDirection: "column"}}>
            
                    {songs.map((el) => {
                    return (<div className="listView" onClick={() => handlePlay(el)}>
                        <img src={el.cover_image} alt={el.song} />
                        <div className="listViewDetails">
                            <h2>{el.song}</h2>
                            <p>{el.artists}</p>
                        </div>
                    </div>)
                })}

            </div>}
            <br />
           { showPlayer?<div className="myPlayer">
                <div> <img src={curr.cover_image} alt={curr.song} /> </div>
                <div>
                    <div> {curr.song} </div>
                    <div> {curr.artists} </div>
                </div> 
                   <div><img style={{borderRadius:'20%'}} src="https://i.gifer.com/origin/55/554818561cbf36d813ef2010cc9d66cc.gif" alt='musicGif'/></div> 
                <audio ref={audioPlayer} autoPlay>
                    <source src={curr.url} ></source>
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