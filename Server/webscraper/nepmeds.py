import requests
import json
import pandas as pd
import time
from bs4 import BeautifulSoup
from requests_html import HTMLSession
import os

# url = "https://www.nepmeds.com.np/api/product/productbycategory/pharmacy?&find_lt_amount=4.5&find_gt_amount=14284.8&find_brand=&product_type=&page=1&size=10"

payload = {}
headers = {
  'authority': 'www.nepmeds.com.np',
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'authorization': 'null',
  'content-type': 'application/json',
  'cookie': '_ga=GA1.1.1234479092.1709106720; _clck=4ia09e%7C2%7Cfjn%7C0%7C1519; _clsk=1pzwyen%7C1709107760489%7C32%7C1%7Cw.clarity.ms%2Fcollect; _ga_4LDEWMD0C2=GS1.1.1709106720.1.1.1709107762.0.0.0',
  'if-none-match': 'W/"1091f-C3wvCc6hEYEx7o78wYGpSweo+TY"',
  'referer': 'https://www.nepmeds.com.np/category/pharmacy',
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}



#-----------------fetch urls from 1mg---------------------

# url=[]
# drug_name = []
# drug_composition = []

# for page in range(1,100):
#     URL = f"https://www.nepmeds.com.np/api/product/productbycategory/pharmacy?&find_lt_amount=4.5&find_gt_amount=14284.8&find_brand=&product_type=&page={page}&size=10"
#     r = requests.get(URL, headers=headers, data=payload)
#     data = json.loads(r.text)
#     url_path = [item['url_key'] for item in data['data']['products']]
#     url += [f"https://www.nepmeds.com.np/detail/{i}" for i in url_path]
#     drug_name += [item['name'] for item in data['data']['products']]
#     if r.status_code != 200:
#         print('data less than 300')
#         break
#     time.sleep(3)
#     print("getting data from page", page)

# print(len(url))
# print(len(drug_name))
# input_data = pd.DataFrame({'URL': url, 'Drug Name': drug_name})
# input_data.to_csv('nepmeds_urls.csv', index=False)



#-----------------fetch data from urls---------------------

s = HTMLSession()
data = pd.read_csv('nepmeds_urls.csv')
url = data['URL'].tolist()
url = url[:1]
# # -----add column to dataframe---
# data['Uses'] = ""
# data['Side Effects'] = ""

# def get_data(url):
#     r = s.get(url)
#     soup = BeautifulSoup(r.text, 'html.parser')
#     use = soup.find('h2', string='Product Overview')
#     uses_data=''
#     if use:
#             parent_div = use.find_parent('div')
#             if parent_div:
#                 content = parent_div.find_all('p')
#                 if content:
#                     uses_data = ' '.join([p.get_text(strip=True) for p in content])
#     effect = soup.find('h2', string='Side Effect')
#     side_effect_data = ''
#     if effect:
#             ul_elements = parent_div.find_all('ul')
#             for ul in ul_elements:
#                 li_items = ul.find_all('li')
#                 for li in li_items:
#                     side_effect_data += li.get_text(strip=True) + ' | '
#     # side_effect = soup.find('div', class_='DrugOverview__list-container___2eAr6 DrugOverview__content___22ZBX').find_all('li')
#     # result = []
#     # for li in use:
#     #     result.append(li.get_text(strip=True))
#     # uses_data = ' | '.join(result)

#     # for li in side_effect:
#     #     result.append(li.get_text(strip=True))
#     # side_effect_data = ' | '.join(result)
#     return uses_data, side_effect_data
# # print(get_data("https://www.1mg.com/drugs/bleocip-15iu-injection-168482"))

# for i in url:
#     uses_data,side_effect_data = get_data(i)
#     data.loc[data['URL'] == i, 'Uses'] = uses_data
#     data.loc[data['URL'] == i, 'Side Effects'] = side_effect_data
#     for j in range (0,100):
#         data.to_csv('nepmeds.csv', index=False) 
#     print(f"getting data from {i}")
#     time.sleep(3)

# print(data)

# url={
#     1:[
#       "https://www.nepmeds.com.np/public/840-840/files/79D03F0D1596FF1-betameth-g1.jpg",
#       "https://www.nepmeds.com.np/public/840-840/files/94E09D10A5E6713-betameth-g2.jpg",
#       "https://www.nepmeds.com.np/public/840-840/files/407B3ACD5CA5A79-betameth-g.jpg",
#     ],
#     2
# }


# Function to scrape images from a webpage
def scrape_images(url, output_dir):
    r = s.get(url)
    soup = BeautifulSoup(r.text, 'html5lib')
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
scrape_images("https://www.nepmeds.com.np/detail/betameth-g-cream", output_dir)



