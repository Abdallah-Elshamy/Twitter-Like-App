FROM python:3.7-slim

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY . .

# Set the API’s port number
EXPOSE 8080

CMD [ "python3", "app.py" ]