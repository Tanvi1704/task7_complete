import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
    return (
        <div>
            {/* <Skeleton count={5} customHighlightBackground="linear-gradient(90deg, var(--base-color) 40%, var(--highlight-color) 50%, var(--base-color) 60%)"/> */}
            <main className="p-6">
            {/* <h1 className="text-3xl font-bold text-center mb-8">Loading...</h1> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 shadow animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
            ))}
            </div>
       </main>
        </div>
    )
}
