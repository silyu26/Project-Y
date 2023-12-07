import { getSolidDataset } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";

function Profile () {

    const { session } = useSession()
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [telecom, setTelecom] = useState("")
    const [birth, setBirth] = useState("")

    useEffect(() => {
        const getPatientProfile = async() => {
            try {
                const profileDataset = await getSolidDataset("https://lab.wirtz.tech/test/patient/patientInformation.ttl", {fetch: session.fetch})
                console.log("profile dataset",profileDataset)
            } catch (error) {
                console.log("error!",error)
            }
        }
        getPatientProfile()
    },[session])

    return (
        <></>
    )
}

export default Profile