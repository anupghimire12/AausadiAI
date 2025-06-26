import json
import pandas as pd

df = pd.DataFrame(columns= ['Drug Name', 'Composition', 'URL'])

with open('nepmed_response.json') as f:
  data = json.load(f)


url = [item[f'url_key'] for item in data['data']['products']]
drug_name = [item['name'] for item in data['data']['products']]
# drug_composition = [item['short_composition'] for item in data['data']['skus']]

# df['Composition'] = drug_composition
df['Drug Name'] = drug_name
df['URL'] = url
print(df)
