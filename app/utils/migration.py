import json
from datetime import datetime


def convert_json_to_db_format(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    formatted_data = {
        'categories': [],
        'subcategories': [],
        'transactions': []
    }

    category_id = 1
    subcategory_id = 1

    for year, months in data.items():
        for month, categories in months.items():
            for category_name, subcategories in categories.items():
                # Check if category already exists
                category = next(
                    (c for c in formatted_data['categories'] if c['name'] == category_name),
                    None
                )

                if not category:
                    category = {
                        'id': category_id,
                        'name': category_name,
                        'budget': 0  # Will be calculated from subcategories
                    }
                    formatted_data['categories'].append(category)
                    category_id += 1

                for subcategory_name, details in subcategories.items():
                    # Create subcategory
                    subcategory = {
                        'id': subcategory_id,
                        'name': subcategory_name,
                        'allotted': float(details['Allotted']),
                        'category_id': category['id']
                    }
                    formatted_data['subcategories'].append(subcategory)

                    # Create transaction if there's spending
                    if float(details['Spending']) > 0:
                        transaction = {
                            'description': details['Comment'] or f"{subcategory_name} for {month} {year}",
                            'amount': float(details['Spending']),
                            'date': datetime.strptime(f"01 {month} {year}", "%d %B %Y").isoformat(),
                            'subcategory_id': subcategory_id
                        }
                        formatted_data['transactions'].append(transaction)

                    subcategory_id += 1

                # Update category budget
                category['budget'] = sum(
                    float(sub['Allotted'])
                    for sub in subcategories.values()
                )

    return formatted_data


