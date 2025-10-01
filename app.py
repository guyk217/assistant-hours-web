import pandas as pd
import os

def read_excel_auto(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    engine = "xlrd" if ext == ".xls" else "openpyxl"
    return pd.read_excel(file_path, header=None, engine=engine)

def split_tables(df):
    start_indices = df[df.apply(lambda row: row.astype(str).str.contains("כניסה", na=False).any(), axis=1)].index.tolist()
    end_indices = df[df.apply(lambda row: row.astype(str).str.contains("חתימה", na=False).any(), axis=1)].index.tolist()
    tables = []
    for start in start_indices:
        end = next((e for e in end_indices if e > start), None)
        if end:
            tables.append(df.loc[start:end].reset_index(drop=True))
        else:
            tables.append(df.loc[start:].reset_index(drop=True))
    return tables

def parse_table(table: pd.DataFrame):
    assistant = str(table.iloc[0, 1]).strip()
    records = []
    for i in range(1, len(table)):
        doctor = table.iloc[i, 0]
        hours_val = table.iloc[i, 1]
        if pd.isna(doctor) or pd.isna(hours_val):
            continue
        if isinstance(hours_val, str) and ":" in hours_val:
            try:
                h, m = hours_val.split(":")
                hours_val = int(h) + int(m)/60
            except:
                continue
        records.append({"Assistant": assistant, "Doctor": str(doctor).strip(), "Hours": float(hours_val)})
    return records

def process_excel(file_path):
    df = read_excel_auto(file_path)
    tables = split_tables(df)
    all_records = [r for t in tables for r in parse_table(t)]
    summary_df = pd.DataFrame(all_records)
    summary = summary_df.groupby(["Assistant", "Doctor"], as_index=False)["Hours"].sum()
    summary["Hours"] = summary["Hours"].round(2)
    summary.to_excel("summary_hours.xlsx", index=False)
