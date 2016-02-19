.PHONY:	build push

build:
	docker build -t eu.gcr.io/$(PROJECT_ID)/nginx-proxy .

push:
	gcloud docker push eu.gcr.io/$(PROJECT_ID)/nginx-proxy
