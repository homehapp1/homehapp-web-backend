.PHONY:	build push

build:
	docker build -t eu.gcr.io/$(PROJECT_ID)/fluentd-sidecar-gcp .

push:
	gcloud docker push eu.gcr.io/$(PROJECT_ID)/fluentd-sidecar-gcp
