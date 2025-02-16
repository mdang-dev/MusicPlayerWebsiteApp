
type Props = {
    handlePlayMusicLiked?: () => void;
    className?: 'boxContainer' | 'boxContainerLg';
}

const SoundLoading = ({
                        handlePlayMusicLiked,
                        className,
                      }:Props) => {

    return (
        <div className={className} onClick={handlePlayMusicLiked} >
            <div className="box box1"></div>
            <div className="box box2"></div>
            <div className="box box3"></div>
            <div className="box box4"></div>
            <div className="box box5"></div>
        </div>
    )

}

export default SoundLoading;