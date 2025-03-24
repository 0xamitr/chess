export default function CustomForm({children, onSubmit}){
    return(
        <form onSubmit={onSubmit} className="absolute flex flex-col gap-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl w-80 max-w-full">

            {children}
        </form>
    )
}