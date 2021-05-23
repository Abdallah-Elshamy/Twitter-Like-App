import {useState} from "react"
import { useDialog } from 'react-st-modal';

function DeleteConfirmationDialog() {
  const dialog = useDialog();

  return (
    <div>
      <h1 className="text-red-700 text-lg text-center">Are you sure you want to delete this tweet?</h1>
      <div className="grid mt-8 mb-8 grid-cols-2 gap-4 w-3/5 mx-auto">
      <button
        className="p-3 bg-red-700 text-white rounded-md border-transparent outline-none transform transition focus:outline-none hover:scale-110"
        onClick={() => {
          dialog.close(1);
        }}
      >
       Yes
      </button>
      <button
        className="p-3 bg-gray-400 text-white rounded-md border-transparent outline-none transform transition focus:outline-none hover:scale-110"
        onClick={() => {
          dialog.close(0);
        }}
      >
        No
      </button>
      </div>
      
    </div>
  );
}
export default DeleteConfirmationDialog