import httpx
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('HEYGEN_API_KEY')
print(f'API Key found: {bool(api_key)}')

r = httpx.get('https://api.heygen.com/v2/avatars', headers={'X-Api-Key': api_key})
print(f'Status: {r.status_code}')
data = r.json()

avatars = data.get('data', {}).get('avatars', [])
print(f'Found {len(avatars)} avatars\n')
for a in avatars[:10]:
    print(f"Avatar ID: {a.get('avatar_id')}")
    print(f"  Name: {a.get('avatar_name', 'N/A')}")
    print()
