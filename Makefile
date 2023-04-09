build:
	docker build -t quan-img .

run: build
	docker-compose up
