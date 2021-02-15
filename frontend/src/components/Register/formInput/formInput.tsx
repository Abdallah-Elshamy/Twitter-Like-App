import React , { FunctionComponent } from 'react';

type FormInputComponentProps = {
    label?: string,
    [key: string]: any
}

export const FormInput: FunctionComponent<FormInputComponentProps> = ({label, ...props}) => {
    return (
        <div className="mb-2 mt-4">
            <label > {label} </label>
            <input {...props} />
        </div>
    )
}


// interface name_Item {
//     label? :string ,
//     placeholder : string ,
//     name? : string ,
//     type? : string,
//     onChange? :
 
// }

// export class FormInput extends Component<name_Item>{
    
// render() {
    
//   return ( 

//        <div className="flex -mx-3 mt-2">
//             <div className="w-full px-3">
//                 <label className="text-xs font-semibold px-1"> { this.props.label } </label>
//                 <div className="flex">
//                     <input  
//                     type={ this.props.type}
//                     name = { this.props.name}
//                     className="w-full h-16 -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300" 
//                     placeholder={ this.props.placeholder}
//                     onChange = { this.props.onChange } 
//                     />
//                 </div>
//             </div>
//         </div>

// );
// }
// }