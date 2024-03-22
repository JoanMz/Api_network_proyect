import Pysqlconnect
import pandas as pd
import re
import sqlalchemy.types

df_registro = pd.read_csv(r"../Datasets/healthcare_dataset.csv")

def drop_blank(String):
    try:
        result = String.split()[0]
        result = "".join(result+String.split()[1])
    except:
        result = String
    return result

def  create_password(email):
    pattern = r"@" #def the pattern to search
    coincidencias = re.search(pattern, email) #search the pattern at email 
    found = coincidencias.start() #save the first index of @ at email
    email = email[:found].lower() #get the text behind @ and transform to lower text
    return email

df_registro["user"] = df_registro["Name"].apply(drop_blank) + df_registro["Age"].astype(str)+ "@gmail.com"  
df_registro.user.nunique()
df_registro.user.value_counts()[df_registro.user.value_counts() > 1].keys()
list_of_duplicates = list(df_registro.user.value_counts()[df_registro.user.value_counts() > 1].keys())

for duplicate in list_of_duplicates:
    index_duplicate = list(df_registro[df_registro["user"]==f"{duplicate}"].index)
    model = df_registro.loc[index_duplicate[0], "Blood Type"]
    for i in range(len(index_duplicate)):
        if i > 0:
            print(index_duplicate[0], end="\n<---<model>--->\n")
            print(index_duplicate[i], end="\n//\n")
            print(f"find duplicate user : {df_registro.loc[index_duplicate[i]], "user"}")
            df_registro.loc[index_duplicate[i], "Blood Type"] = model
                 
print("<-- fix inconsistency -->")

df_user = df_registro.loc[:, ("user","Name")].copy()
df_user.drop_duplicates(inplace=True)
df_user["password"] = df_user["user"].apply(create_password)
df_user.drop_duplicates(inplace=True)
df_user["type"] = 1

s_doctor = df_registro.loc[:, ("Doctor")].copy()
s_doctor_user = s_doctor.apply(drop_blank) + "@gmail.com"

df_doctor = pd.DataFrame({
                          "user":s_doctor_user,
                          "Name":s_doctor    
})

df_doctor.drop_duplicates(inplace=True)
df_doctor["password"] = df_doctor["user"].apply(create_password)
df_registro = df_registro.loc[:, ("user", "Name", "Age", "Gender", "Blood Type", "Insurance Provider", "Medication", "Doctor" )].copy()
df_registro["Doctor_user"] = df_registro.Doctor.apply(drop_blank) + "@gmail.com"


Pysqlconnect.connection().connect().rollback()
df_registro.to_sql("registro", con=Pysqlconnect.connection(), if_exists="replace", index=False, dtype={
                                                                                          "user":sqlalchemy.types.String(40),
                                                                                          "Namae":sqlalchemy.types.String(40),
                                                                                          "Age":sqlalchemy.types.INTEGER(),
                                                                                          "Gender":sqlalchemy.types.String(10),
                                                                                          "Blood Type":sqlalchemy.types.String(5),
                                                                                          "Insurance Provider":sqlalchemy.types.String(40),
                                                                                          "Medication":sqlalchemy.types.String(40),
                                                                                          "Doctor":sqlalchemy.types.String(40),
                                                                                          "Doctor_user":sqlalchemy.types.String(40)
                                                                                          })

df_user.to_sql("users", con=Pysqlconnect.connection(), if_exists="replace", index=False, dtype={"user":sqlalchemy.types.String(40),
                                                                                                "password":sqlalchemy.types.String(40),
                                                                                                "Name":sqlalchemy.types.String(40)})


df_doctor.to_sql("doctors", con=Pysqlconnect.connection(), if_exists="replace", dtype={"user":sqlalchemy.types.String(40),
                                                                                                "password":sqlalchemy.types.String(40),
                                                                                                "Name":sqlalchemy.types.String(40)})

df_registro.to_csv("../Datasets/registro.csv")
df_user.to_csv("../Datasets/users.csv")
df_user.to_csv("../Datasets/doctors.csv")
