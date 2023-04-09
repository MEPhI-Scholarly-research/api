build:
	docker stop quan || true && docker rm quan || true
	docker rmi quan-img || true
	docker build -t quan-img .

run: build
	docker-compose up
