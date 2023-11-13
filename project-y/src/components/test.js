import { getSolidDataset, getThing, getStringNoLocale } from '@inrupt/solid-client';
import { useEffect, useState } from 'react';


function Test() {

    const [webId,setWebId] = useState('https://lab.wirtz.tech/test/profile/card#me')

    useEffect(() => {
        async function fetchDataFromSolidPod(webId) {
          const session = await fetch(webId);
          const myDataset = await getSolidDataset(webId, { fetch: fetch });
          const profileThing = getThing(myDataset, webId);
          const profileName = getStringNoLocale(profileThing, 'http://www.w3.org/2006/vcard/ns#fn');   
          console.log(`Profile name: ${profileName}`);
        }
        fetchDataFromSolidPod(webId)
    },[webId])

    

    return(
        <h5>fetch</h5>
    )
}

export default Test