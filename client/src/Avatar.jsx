export default function Avatar({userId,username}){
    const colors= ['bg-red-200', 'bg-green-200','bg-purple-200','bg-pink-200',
    'bg-yellow-200','bg-violet-200'];
    // console.log(userId)
    // const userIdBase10=parseInt(userId,16);
    // console.log(userIdBase10%colors.length)
    function generateRandomColor(){
        let colorIndex=Math.floor(Math.random()* colors.length);
        return colors[colorIndex];
    }
    const color=generateRandomColor();
    // console.log(color);
    return(
        <div className={"w-8 h-8 rounded-full flex items-center "+color}>
        <div className="text-center w-full opacity-70">{username[0]}</div>
        </div>

    )
}