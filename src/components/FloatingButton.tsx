import { ComponentProps } from "react"
import { AiOutlineDownload } from "react-icons/ai"

export default function FloatingButton(props: ComponentProps<"button">) {
    return (
        <div className="fixed right-6 bottom-6">
            <div className="tooltip tooltip-left" data-tip="Download CV">
                <button
                    {...props}
                    type="button"
                    className="flex items-center justify-center text-white rounded-full w-14 h-14 btn btn-primary dark:hover:bg-purple-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:purple:ring-blue-800">
                    <AiOutlineDownload className="w-12 h-12" />
                </button>
            </div>
        </div>
    );
}
