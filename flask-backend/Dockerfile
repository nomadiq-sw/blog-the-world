FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

RUN adduser -D appuser
USER appuser
WORKDIR /home/appuser/app

COPY --chown=appuser:appuser requirements.txt ./
RUN pip install --user --no-cache-dir -r requirements.txt

ENV PATH="/home/appuser/.local/bin:${PATH}"

COPY --chown=appuser:appuser . .