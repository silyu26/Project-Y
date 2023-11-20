import { getSolidDataset, saveSolidDatasetAt, createSolidDataset, getThingAll, getUrlAll } from '@inrupt/solid-client'
import { useSession, Table, TableColumn } from '@inrupt/solid-ui-react'
import { useEffect, useState } from 'react'

const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage"
const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#created";

function Test() {

    const { session } = useSession()
    const [patient, setPatient] = useState(null)

    const patientThings = patient ? getThingAll(patient) : [];
    const thingsArray = patientThings.map((t) => {
        return { dataset: patient, thing: t };
    })

    const getOrCreatePatient = async (containerUri, fetch) => {
        const indexUrl = `${containerUri}index.ttl`
        try{
          const patient = await getSolidDataset(indexUrl, {fetch})
          return patient
        } catch (error) {
          if(error.statusCode === 404) {
            const patient = await saveSolidDatasetAt(
              indexUrl,
              createSolidDataset(), {
                fetch,
              }
            )
            return patient
          }
        }
    }

    const toDateString = (date) => {
        const parsedDatetime = new Date(date)
        const formattedDatetimeStr = `${parsedDatetime.getDate()},${parsedDatetime.getMonth() + 1},${parsedDatetime.getFullYear()}`
        return formattedDatetimeStr
    }

    useEffect(() => {
      if (!session || !session.info.isLoggedIn) return
      (async () => {
        const profileDataset = await getSolidDataset(session.info.webId, {
          fetch: session.fetch,
        })
        // const profileThing = getThing(profileDataset, session.info.webId)
        // const podsUrls = getUrlAll(profileThing, STORAGE_PREDICATE)
        // const pod = podsUrls[0]
        const containerUri = 'https://lab.wirtz.tech/test/patient/'
        const patient = await getOrCreatePatient(containerUri, session.fetch)
        console.log("patient got:",patient)
        setPatient(patient)
        console.log("thingsArray:",thingsArray)
      })()
    }, [session, session.info.isLoggedIn])

    return(
        <div>
          <div>Your patient list has {patientThings.length} items</div>
          <Table things={thingsArray}>
            <TableColumn property={TEXT_PREDICATE} header="Text"/>
            <TableColumn property={CREATED_PREDICATE}
              dataType='datetime'
              header="Created At"
              body={({value}) => toDateString(value)} 
            />
           </Table>
        </div>
    )
}

export default Test