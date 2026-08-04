import Input from "../../components/ui/Input/Input";

function DoctorSearch({
    value,
    onChange
}) {

    return (

        <div className="toolbar">

            <Input
                placeholder="Search doctor..."
                value={value}
                onChange={onChange}
            />

        </div>

    );

}

export default DoctorSearch;