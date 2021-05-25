import { useDialog } from "react-st-modal";

function ErrorDialog(props: any) {
    const dialog = useDialog();

    return (
        <div>
            <h1 className="text-red-700 text-lg text-center">
                {props.message}
            </h1>

            <button
                className="p-3 bg-gray-400 text-white rounded-md border-transparent outline-none transform transition focus:outline-none hover:scale-110 mx-auto block w-20 mt-5 mb-5"
                onClick={() => {
                    dialog.close(0);
                }}
            >
                Ok
            </button>
        </div>
    );
}
export default ErrorDialog;
