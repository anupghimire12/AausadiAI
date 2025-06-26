import requests
import json
import pandas as pd
import time
from bs4 import BeautifulSoup
from requests_html import HTMLSession
import os

# url = "https://www.1mg.com/pharmacy_api_gateway/v4/drug_skus/by_prefix?prefix_term=a&page=1&per_page=20"

payload={}
headers = {
  'authority': 'www.1mg.com',
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache, no-store, must-revalidate',
  'cookie': 'VISITOR-ID=829c4d27-4dbf-402b-c0b4-36bc98461d0e_Iscp11_1704349639245; abVisitorId=135573; abExperimentShow=false; _csrf=FH4-jvk71NuGqt2A505BSrBx; isLocaleRedirect=false; isLocaleUIChange=false; _fbp=fb.1.1704349639868.1131365104; rl_page_init_referrer=RudderEncrypt%3AU2FsdGVkX19NHsJx%2Fr7qlZLJNSvMsQuPJAqw0twlu1hLJXdA9L5oFrWs0f1M%2FEGP; rl_page_init_referring_domain=RudderEncrypt%3AU2FsdGVkX18BkOKADSt%2BgPHRMZiWHMMNmBVA5hSHhyucnlOG7P3aAi%2BR%2BSfermBo; jarvis-id=18147bb4-d149-4e2c-aa0c-e2759f1a21a1; synapse:init=false; synapse:platform=web; _gcl_au=1.1.1995048972.1704349640; MgidSensorNVis=1; MgidSensorHref=https://www.1mg.com/?wpsrc=Google+Organic+Search; __gads=ID=ce02b80843c4ba1f:T=1704349640:RT=1704349640:S=ALNI_Ma96RcBjUnqM9qet8Fa8vKbW9ZHvw; __gpi=UID=00000cd126ee479b:T=1704349640:RT=1704349640:S=ALNI_Mb9UATgAtZThE8Q_sCtNiET8yGrsg; __rtbh.lid=%7B%22eventType%22%3A%22lid%22%2C%22id%22%3A%22EV5YQH2nBhLtwaxf79IN%22%7D; _nv_did=173339004.1704349641.2001:df7:be80:14ad:6c27:8ee8:bd0d:889a1dnks; __adroll_fpc=da512e447152b311af23309cbc589324-1704349641724; singular_device_id=c3936629-ea9b-4cae-a73c-aae645ea6700; __ar_v4=%7CU4ZFS2QH4VB65A54O43AEQ%3A20240103%3A1%7C6PFMKMAZXFGFLMSXPCJHFF%3A20240103%3A1%7CKJTLL7NSNRFA5J3GVYGJVJ%3A20240103%3A1; cto_bundle=EcfqaV9EaU1jTGdmc1hXRWhwVVJwcU55UTVVa2dtdWJCdEZza0Q5cXNjY2FHUUNkYXJNZkRhbEdRM2xDZnp6V2lpT2xyWkd5THNaVkpaRVVleTdzUzFVN0l3QVhIZnR3aHN4dFNDYWI2dUk1JTJGb3UlMkJJMU1VY2k5ZHBXcjFjSVBnRlU2eFZheHlvUiUyQnNTd09XckdJVzJtVGJTbnFZUjFkWVlGblduRkNLclU1OGdoY0ZwYSUyQjJ2ZnhEVDAyMUQ2TEhSWjAxMHo2NG84aTZHaU40SnRrb3ZVMDhEM2clM0QlM0Q; city=New%20Delhi; geolocation=false; _nv_sess=173339004.1709021122.Xvrrx9BFMLfaZ9Zhm5psnbJSAMV7FVVxNpZgneIpP3D210VhNF; _nv_uid=173339004.1704349641.e6f6ae1d-938f-4625-9545-769b384e367e.1704349641.1709021122.2.0; _nv_utm=173339004.1704349641.2.1.dXRtc3JjPWdvb2dsZXx1dG1jY249KG5vdCBzZXQpfHV0bWNtZD1vcmdhbmljfHV0bWN0cj0obm90IHByb3ZpZGVkKXx1dG1jY3Q9KG5vdCBzZXQpfGdjbGlkPShub3Qgc2V0KQ==; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.171581612.1709021123; shw_13453=1; _nv_banner_x=13453; session=r90sK7efbZBQ4fAxg8Du3w.oE4jgDqO6x0PuWI-FSRyWhkczVgnVoyvla9gWQ73UKYxx__SA6N5XPaJKjHBNT9bcmHYCkyeKPep7vNOFOvXN8sQEfQbEZln_wE96iTQU6yGvl_t7GO7tu1OotKzo503tLX97QGO3ryADSo5MuJJWdmGVqRAAYCXMpiEsKs0-GI44lWW8QrP5jC3bn_MZxE65sU5bcYkI7F76nysNcWvv0GA55qXYccIJZfKtPSI6R9yr9uaAPbthnypa7xN49aKtP0MoscXuCixnSH227VsnA.1709021120901.144000000.570Qza-57zW168ESKx2vYrDoxnB7Lc4AzziiMZGT-EQ; amoSessionId=ac53bda9-0740-4bee-ade9-388cce8db19d; rl_user_id=RudderEncrypt%3AU2FsdGVkX1%2FzkTRDemVi8GB3FR9XhlN6yz8Ovlfx2BU%3D; rl_trait=RudderEncrypt%3AU2FsdGVkX1%2FA5GGPuHBp%2B2NieeSQznage3TElxzkbj4%3D; rl_group_id=RudderEncrypt%3AU2FsdGVkX184PqL4%2Bd8KiMcY%2BnqeNu9xvQSYRrijaJw%3D; rl_group_trait=RudderEncrypt%3AU2FsdGVkX19kI%2Bg1k3oACbHu3Y0GESQCC5rWuSlnMsU%3D; rl_anonymous_id=RudderEncrypt%3AU2FsdGVkX18KXL2lelgtDV53LfyAm9YrvAdFKUixloGFJ4ZYJvTNciYDb7hvBFopMBeM5h%2Fq27RlaPLcWSqkKg%3D%3D; AWSALBTG=kGR9MMcudR1/djefFYech6rFl4+Q+wMe6Le2Qvp3+L08in953hTQlvQdi5zYhqPnn6XULxJJY4DoYOE0Tq2bsmHTXORfy7n91W+H74YlQLavAvdPYyG3RkX2cOUJB7QlEr/89VPSPZhwMFbcpF/Dnlot3EBtYFBkUgdFK9izqqpD; AWSALBTGCORS=kGR9MMcudR1/djefFYech6rFl4+Q+wMe6Le2Qvp3+L08in953hTQlvQdi5zYhqPnn6XULxJJY4DoYOE0Tq2bsmHTXORfy7n91W+H74YlQLavAvdPYyG3RkX2cOUJB7QlEr/89VPSPZhwMFbcpF/Dnlot3EBtYFBkUgdFK9izqqpD; _uetsid=f4259af0d54611eea4d1bb1b8c292dd8; _uetvid=50588410aaca11eea31c977dd7872175; _ga_1HF6RR2VT7=GS1.1.1709021121.3.1.1709023061.0.0.0; _nv_hit=173339004.1709023061.cHZpZXc9MTN8YnZpZXc9WyIxMzQ1MyJd; _ga_NPGHGVF7FB=GS1.1.1709021121.3.1.1709023191.60.0.0; _ga=GA1.2.518776098.1704349640; _gat_UA-21820217-6=1; rl_session=RudderEncrypt%3AU2FsdGVkX18%2ByLkKujE2h4a6FljwwhOqnrJrgBsR9lCwv1Tj1cksAUZluy0BIpxnnXi3IxM7KVdp5p5qcvh%2BzXZjwzGBPAbvqAQxeVDZtvnGKbENQLnXwGe%2BlSZt5bNaXRdguhtY3DiAPy5ZbeLspA%3D%3D; AWSALBTG=/mPZJ0jpvJYRg7ByWyqJYBvr8hzddLJqDgx/QQQofsDTpZoEieQpZhXBL/bvGqX+LNGXjael584tOV36kg1r7IHTah9cEtd3nT7Xr/d8t29LBqRqUYWwa5YfBHDNUT3WZbyp+DXaUHFnoME1iFBTLQHguvW/TGTGJqRyMe2i7CAJ; AWSALBTGCORS=/mPZJ0jpvJYRg7ByWyqJYBvr8hzddLJqDgx/QQQofsDTpZoEieQpZhXBL/bvGqX+LNGXjael584tOV36kg1r7IHTah9cEtd3nT7Xr/d8t29LBqRqUYWwa5YfBHDNUT3WZbyp+DXaUHFnoME1iFBTLQHguvW/TGTGJqRyMe2i7CAJ',
  'hkp-platform': 'Healthkartplus-0.0.1-Desktop',
  'pragma': 'no-cache',
  'referer': 'https://www.1mg.com/drugs-all-medicines?label=b',
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'x-csrf-token': '0BULuZwF-qySv9uU7wTj8nXI__4YXEkM_MpQ',
  'x-html-canrender': 'True',
  'x-platform': 'Desktop-0.0.1'
}



#-----------------fetch urls from 1mg---------------------

# url=[]
# drug_name = []
# drug_composition = []

# for page in range(1,15):
#     URL = f"https://www.1mg.com/pharmacy_api_gateway/v4/drug_skus/by_prefix?prefix_term=a&page={page}&per_page=20"
#     r = requests.get(URL, headers=headers, data=payload)
#     data = json.loads(r.text)
#     url += [item['url'] for item in data['data']['schema']['itemListElement']]
#     drug_name += [item['name'] for item in data['data']['schema']['itemListElement']]
#     drug_composition += [item['short_composition'] for item in data['data']['skus']]
#     if r.status_code != 200:
#         print('data less than 300')
#         break
#     time.sleep(3)
#     print("getting data from page", page)

# print(len(url))
# input_data = pd.DataFrame({'URL': url, 'Drug Name': drug_name, 'Composition': drug_composition})
# input_data.to_csv('1mg_urls.csv', index=False)



#-----------------fetch data from urls---------------------

s = HTMLSession()
data = pd.read_csv('1mg_urls.csv')
url = data['URL'].tolist()
# -----add column to dataframe---
# data['Uses'] = ""
# data['Side Effects'] = ""



# url = url[:10]
# def get_data(url):
#     r = s.get(url)
#     soup = BeautifulSoup(r.text, 'html.parser')
#     use = soup.find('ul', class_='DrugOverview__list___1HjxR DrugOverview__uses___1jmC3').find_all('li')
#     side_effect = soup.find('div', class_='DrugOverview__list-container___2eAr6 DrugOverview__content___22ZBX').find_all('li')
#     result = []
#     for li in use:
#         result.append(li.get_text(strip=True))
#     uses_data = ' | '.join(result)

#     for li in side_effect:
#         result.append(li.get_text(strip=True))
#     side_effect_data = ' | '.join(result)
#     return uses_data, side_effect_data
# # print(get_data("https://www.1mg.com/drugs/bleocip-15iu-injection-168482"))

# for i in url:
#     uses_data, side_effect_data = get_data(i)
#     data.loc[data['URL'] == i, 'Uses'] = uses_data
#     data.loc[data['URL'] == i, 'Side Effects'] = side_effect_data
#     time.sleep(3)
#     print(f"getting data from {i}")

# data.to_csv('1mg_data_test.csv', index=False)



# Function to scrape images from a webpage
def scrape_images(url, output_dir):
    r = s.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    img_tags = soup.find_all('img')
    print(img_tags,"hi")
    for img_tag in img_tags:
        img_url = img_tag['src']
        img_name = img_url.split('/')[-1]  # Extract filename
        img_path = os.path.join(output_dir, img_name)
        print("hi")
        # Download image
        img_data = s.get(img_url).content
        with open(img_path, 'wb') as f:
            f.write(img_data)
output_dir = 'images'
scrape_images(url[0], output_dir)




