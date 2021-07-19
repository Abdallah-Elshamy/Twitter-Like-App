

const FoF: React.FC<{ fof?: boolean, msg?: string, secMsg?: string , className?:string}> = ({ fof = true, msg, secMsg,className }) => {

  return (<div className={`w-full flex flex-col  justify-center items-center h-3/4 pb-4 ${className}`}>

    {fof && <h1 className="text-6xl text-gray-800 ">404</h1>}
    <p className="text-lg text-gray-800">{msg}</p>
    <p className="text-sm text-gray-400 ">{secMsg}</p>
  </div>)
}
export default FoF