import os
import requests
from solid_oidc_client import SolidAuthSession

def create_folder(pod_base_url, folder_path, session: SolidAuthSession):
    """
    Create a folder on a Solid Pod.

    Args:
        pod_base_url (str): The base URL of the Solid Pod (e.g., "https://example.solidcommunity.net").
        folder_path (str): The path of the folder to be created (e.g., "/private/new_folder").
        session (SolidAuthSession): The Solid authentication session.

    Returns:
        requests.Response: The response object from the Pod server.
    """
    folder_url = f"{pod_base_url}{folder_path}/"

    headers = {
        'Authorization': f'Bearer {session.access_token}',
        'Content-Type': 'text/n3',
        'Slug': os.path.basename(folder_path.rstrip('/')),  # Extract the folder name
    }

    # Use PUT request to create the folder
    res = requests.put(folder_url, headers=headers)
    
    return res


