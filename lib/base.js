(function (window) {

	'use strict';

	class Xpower {

		static text() {
			return 'metodo di calcolo in potenza';
		}
		static color() {
			return '#00aee0';
		}
	}

	class Energy {

		static text() {
			return 'metodo di calcolo in energia';
		}
		static color() {
			return '#4ee000';
		}
	}

	class Line {

		static style(color) {
			let properties = 'fill:$c;stroke:$c;stroke-width:$s;';
			if (typeof color !== 'string'
				|| color.length < 3) color = '#000000';

			return properties.replaceAll('$s', window.VIMQ.stroke()).replaceAll('$c', color);
		}
		static coordinate(type, y, t, percentage) {
			let x = window.VIMQ.conversion(percentage);
			type.setAttribute('x1', x.toString());
			type.setAttribute('y1', y);
			type.setAttribute('x2', x.toString());
			type.setAttribute('y2', t);
			return x;
		}
	}

	class Render {

		static coefficient() {
			return 0.3;
		}
		static color() {
			return '#f00f00';
		}
		static margin() {
			return 25;
		}
		static fx() {
			return [
				'%E = {[$0 + $5] / 2}',
				'%E = {[$3 + $2] / 2}',
				'%E = {[$3 + $5] / 2}',
				'%E = {[$0 + $2] / 2}',
				'%E = {[$5 + $0] / 2}',
				'%E = {[$4 + $5] / 2}',
				'%E = {[$2 + $3] / 2}',
				'%E = {[$1 + $2] / 2}'
			];
		}

		constructor(vimq) {
			this.vimq = vimq;
			this.elements = {};
			this.coordinate = {
				final: 0
			};
		}

		getVIMQ() {
			return this.vimq;
		}
		getData() {
			let vimq = this.getVIMQ(),
				xpower = vimq.getXpower().getPercentage(),
				energy = vimq.getEnergy().getPercentage();

			return xpower.concat(energy);
		}
		getCoordinate() {
			return this.coordinate;
		}
		getGroup() {
			if (this.elements.hasOwnProperty('group')) return this.elements.group;
			let final = this.getFinal(),
				text = this.getText();

			this.elements.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			this.elements.group.appendChild(final);
			this.elements.group.appendChild(text);
			return this.elements.group;
		}
		getFinal() {
			if (this.elements.hasOwnProperty('final')) return this.elements.final;
			let color = this.constructor.color();
			this.elements.final = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			this.elements.final.setAttribute('style', window.VIMQ.Line.style(color));
			return this.elements.final;
		}
		getText() {
			if (this.elements.hasOwnProperty('text')) return this.elements.text;
			this.elements.text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			this.elements.text.setAttribute('style', window.VIMQ.Info.style('#f00f00', 32));
			return this.elements.text;
		}
		setText(text) {
			let element = this.getText(),
				label = document.createTextNode(text);

			window.VIMQ.clear(element);
			element.appendChild(label);

			return this;
		}
		setFinal(percentage) {
			let final = this.getFinal(),
				coordinate = this.getCoordinate(),
				y = this.constructor.margin(),
				t = window.VIMQ.height() - this.constructor.margin();

			coordinate.final = window.VIMQ.Line.coordinate(final, y, t, percentage);

			let position = t + window.VIMQ.Info.space() + 5,
				transform = String.fromCharCode(32) + coordinate.final + String.fromCharCode(32) + position,
				text = percentage.toFixed(2) + String.fromCharCode(32) + String.fromCharCode(37);

			this.getText().setAttribute('transform', 'matrix(1 0 0 1' + transform + ')');
			this.setText(text);

			return this;
		}
		getCase() {
			let data = this.getData();
			switch (true) {
				case data[3] <= data[0] && data[0] <= data[5] && data[5] <= data[2]:
					return 0;
				case data[3] <= data[2] && data[2] <= data[5] && data[0] <= data[3]:
					return 1;
				case data[0] <= data[3] && data[3] <= data[2] && data[0] <= data[5] && data[5] <= data[2]:
					return 2;
				case data[3] <= data[0] && data[0] <= data[5] && data[3] <= data[2] && data[2] <= data[5]:
					return 3;
				case data[5] <= data[0] && data[1] <= data[5] + data[5] * this.constructor.coefficient():
					return 4;
				case data[5] <= data[0] && data[1] > data[5] + data[5] * this.constructor.coefficient():
					return 5;
				case data[2] <= data[3] && data[1] >= data[3] - data[3] * this.constructor.coefficient():
					return 6;
				case data[2] <= data[3] && data[1] < data[3] - data[3] * this.constructor.coefficient():
					return 7;
			}
			return null;
		}
		getFx() {
			let data = this.getData(),
				fx = this.constructor.fx(),
				c = this.getCase();

			if (!fx.hasOwnProperty(c)) return null;
			for (let item = 0; item < data.length; item++) fx[c] = fx[c].replace('$' + item, data[item].toFixed(2));
			return fx[c];
		}
		getCalculator() {
			let response = [],
				data = this.getData();

			response.push((data[0] + data[5]) / 2);
			response.push((data[3] + data[2]) / 2);
			response.push((data[3] + data[5]) / 2);
			response.push((data[0] + data[2]) / 2);
			response.push((data[0] + data[5]) / 2);
			response.push((data[4] + data[5]) / 2);
			response.push((data[2] + data[3]) / 2);
			response.push((data[1] + data[2]) / 2);

			return response;
		}
		getFinalPercentage() {
			let calculator = this.getCalculator(),
				index = this.getCase();
			if (index === null
				|| !calculator.hasOwnProperty(index)) return 0;

			return calculator[index];
		}
		getVIMQ() {
			return this.vimq;
		}
		out() {
			return this.getGroup();
		}
		run() {
			let percentage = this.getFinalPercentage();
			this.setFinal(percentage);
			return this;
		}
	}

	class Rectangle {

		static height() {
			return 80;
		}
		static group() {
			return 'opacity:0.5;';
		}

		constructor(info) {
			this.info = info;
			this.elements = {};
			this.coordinate = {
				min: 0,
				max: 0
			};
		}

		getInfo() {
			return this.info;
		}
		getCoordinate() {
			return this.coordinate;
		}
		getGroup() {
			if (this.elements.hasOwnProperty('group')) return this.elements.group;
			let min = this.getMin(), figure = this.getFigure(), max = this.getMax();
			this.elements.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			this.elements.group.setAttribute('style', this.constructor.group());
			this.elements.group.appendChild(figure);
			this.elements.group.appendChild(min);
			this.elements.group.appendChild(max);
			return this.elements.group;
		}
		getMin() {
			if (this.elements.hasOwnProperty('min')) return this.elements.min;
			let color = this.getInfo().getType().color();
			this.elements.min = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			this.elements.min.setAttribute('style', window.VIMQ.Line.style(color));
			return this.elements.min;
		}
		setMin(percentage) {
			let min = this.getMin(),
				coordinate = this.getCoordinate(),
				y = this.getInfo().getPosition(),
				t = window.VIMQ.Xpower === this.getInfo().getType() ? y + this.constructor.calculate() : y - this.constructor.calculate();

			coordinate.min = window.VIMQ.Line.coordinate(min, y, t, percentage);
			this.render();

			return this;
		}
		getFigure() {
			if (this.elements.hasOwnProperty('figure')) return this.elements.figure;
			let y = this.getInfo().getPosition(),
				t = window.VIMQ.Xpower === this.getInfo().getType() ? y + window.VIMQ.Info.space() + window.VIMQ.stroke() : y - window.VIMQ.Info.space() - this.constructor.height() - window.VIMQ.stroke(),
				color = this.getInfo().getType().color();

			this.elements.figure = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			this.elements.figure.setAttribute('y', t);
			this.elements.figure.setAttribute('height', this.constructor.height());
			this.elements.figure.setAttribute('style', window.VIMQ.Line.style(color));

			return this.elements.figure;
		}
		getMax() {
			if (this.elements.hasOwnProperty('max')) return this.elements.max;
			let color = this.getInfo().getType().color();
			this.elements.max = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			this.elements.max.setAttribute('style', window.VIMQ.Line.style(color));
			return this.elements.max;
		}
		setMax(percentage) {
			let max = this.getMax(),
				coordinate = this.getCoordinate(),
				y = this.getInfo().getPosition(),
				t = window.VIMQ.Xpower === this.getInfo().getType() ? y + this.constructor.calculate() : y - this.constructor.calculate();

			coordinate.max = window.VIMQ.Line.coordinate(max, y, t, percentage);
			this.render();

			return this;
		}
		render() {
			let coordinate = this.getCoordinate();
			if (coordinate.max <= coordinate.min
				|| coordinate.min === 0
				|| coordinate.max === 0) return this;

			let width = coordinate.max - coordinate.min;
			this.getFigure().setAttribute('x', coordinate.min);
			this.getFigure().setAttribute('width', width);

			this.getInfo().getVIMQ().getRender().run();

			return this;
		}
		out() {
			return this.getGroup();
		}
		static calculate() {
			return window.VIMQ.height() - 2 * window.VIMQ.Info.margin() + window.VIMQ.Info.space();
		}
	}

	class Description {

		static x() {
			return 150;
		}

		constructor(info) {
			this.info = info;
			this.elements = {};
		}

		getInfo() {
			return this.info;
		}
		getText() {
			if (this.elements.hasOwnProperty('element')) return this.elements.element;
			this.elements.element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			this.elements.element.setAttribute('style', window.VIMQ.Info.style('#000000', 16, 'left'));
			return this.elements.element;
		}
		setText(text) {
			let element = this.getText(),
				label = document.createTextNode(text),
				position = this.getInfo().getPosition(),
				y = window.VIMQ.Energy === this.getInfo().getType() ? position : position + 0.5 * window.VIMQ.Info.space(),
				t = String.fromCharCode(32) + this.constructor.x() + String.fromCharCode(32) + y;

			window.VIMQ.clear(element);
			element.setAttribute('transform', 'matrix(1 0 0 1' + t + ')');
			element.appendChild(label);
			return this;
		}
		out() {
			return this.getText();
		}
	}

	class Info {

		static space() {
			return 20;
		}
		static style(color, size, anchor) {
			let parameters = 'text-anchor:$a;font-size:$spx;fill:$c;';

			if (typeof size !== 'number'
				|| false === Number.isInteger(size)) size = 24;

			if (typeof anchor !== 'string'
				|| anchor.length < 3) anchor = 'middle';

			return parameters.replaceAll('$c', color).replaceAll('$s', size).replaceAll('$a', anchor);
		}
		static margin() {
			return 80;
		}

		constructor(vimq, type) {
			this.vimq = vimq;
			this.type = type;
			this.elements = {};
			this.elements.rectangle = new window.VIMQ.Info.Rectangle(this);
			this.elements.description = new window.VIMQ.Info.Description(this);
			this.elements.description.setText(type.text());

			this.percentage = [0, 0, 0];
		}

		getVIMQ() {
			return this.vimq;
		}
		getType() {
			return this.type;
		}
		getPercentage() {
			return this.percentage;
		}
		getDescription() {
			return this.elements.description;
		}
		getRectangle() {
			return this.elements.rectangle;
		}
		getPosition() {
			return window.VIMQ.Xpower === this.getType() ? this.constructor.margin() - this.constructor.space() : window.VIMQ.height() - this.constructor.margin() + this.constructor.space();
		}
		getGroup() {
			if (this.elements.hasOwnProperty('group')) return this.elements.group;
			let description = this.getDescription(),
				rectangle = this.getRectangle(),
				lie = this.getLine(),
				min = this.getMin(),
				val = this.getVal(),
				max = this.getMax();

			this.elements.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			this.elements.group.appendChild(description.out());
			this.elements.group.appendChild(rectangle.out());
			this.elements.group.appendChild(min);
			this.elements.group.appendChild(val);
			this.elements.group.appendChild(lie);
			this.elements.group.appendChild(max);
			return this.elements.group;
		}
		getMin() {
			if (this.elements.hasOwnProperty('min')) return this.elements.min;
			this.elements.min = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			this.elements.min.setAttribute('style', this.constructor.style('#000000'));
			return this.elements.min;
		}
		setMin(percentage) {
			let min = this.getMin(),
				position = this.getPosition(),
				space = 2 * window.VIMQ.stroke(),
				y = window.VIMQ.Xpower === this.getType() ? position - space : position + space + this.constructor.space();

			this.percentage[0] = percentage;
			this.constructor.text(min, y, percentage);
			this.getRectangle().setMin(percentage);

			return this;
		}
		getLine() {
			if (this.elements.hasOwnProperty('line')) return this.elements.line;
			this.elements.line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			this.elements.line.setAttribute('style', window.VIMQ.Line.style('#d12d2a'));
			return this.elements.line;
		}
		setLine(percentage) {
			let x = window.VIMQ.conversion(percentage).toString(),
				dimensions = this.constructor.space() + window.VIMQ.Info.Rectangle.height(),
				y = this.getPosition(),
				coordinate = window.VIMQ.Xpower === this.getType() ? y + dimensions + window.VIMQ.stroke() : y - dimensions - window.VIMQ.stroke();

			this.getLine().setAttribute('x1', x);
			this.getLine().setAttribute('y1', y);
			this.getLine().setAttribute('x2', x);
			this.getLine().setAttribute('y2', coordinate);

			return this;
		}
		getVal() {
			if (this.elements.hasOwnProperty('val')) return this.elements.val;
			this.elements.val = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			this.elements.val.setAttribute('style', this.constructor.style('#d12d2a'));
			return this.elements.val;
		}
		setVal(percentage) {
			let val = this.getVal(),
				position = this.getPosition(),
				space = 2 * window.VIMQ.stroke(),
				y = window.VIMQ.Xpower === this.getType() ? position - space : position + space + this.constructor.space();

			this.percentage[1] = percentage;
			this.constructor.text(val, y, percentage);
			this.setLine(percentage);

			return this;
		}
		getMax() {
			if (this.elements.hasOwnProperty('max')) return this.elements.max;
			this.elements.max = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			this.elements.max.setAttribute('style', this.constructor.style('#000000'));
			return this.elements.max;
		}
		setMax(percentage) {
			let max = this.getMax(),
				position = this.getPosition(),
				space = 2 * window.VIMQ.stroke(),
				y = window.VIMQ.Xpower === this.getType() ? position - space : position + space + this.constructor.space();

			this.percentage[2] = percentage;
			this.constructor.text(max, y, percentage);
			this.getRectangle().setMax(percentage);

			return this;
		}
		out() {
			return this.getGroup();
		}
		render() {
			let percentage = this.getPercentage();
			this.setMin(percentage[0]);
			this.setVal(percentage[1]);
			this.setMax(percentage[2]);
			return this;
		}
		static text(element, y, percentage) {
			let label = document.createTextNode(percentage.toFixed(2) + String.fromCharCode(32) + String.fromCharCode(37)),
				x = window.VIMQ.conversion(percentage),
				t = String.fromCharCode(32) + x + String.fromCharCode(32) + y;

			window.VIMQ.clear(element);
			element.setAttribute('transform', 'matrix(1 0 0 1' + t + ')');
			element.appendChild(label);
		}
	}

	class VIMQ {

		static min() {
			return 3;
		}
		static max() {
			return 9;
		}
		static board() {
			return 1800;
		}
		static margin() {
			return 100;
		}
		static height() {
			return 400;
		}
		static grid(y) {
			let g = 'M100,#yh#wH#mz';
			if (typeof y !== 'number'
				|| !Number.isInteger(y)) y = 0;
			return g.replaceAll('#w', this.width()).replaceAll('#m', this.margin()).replaceAll('#y', y);
		}
		static stroke() {
			return 2;
		}

		constructor() {
			this.elements = {};
			this.elements.render = new window.VIMQ.Render(this);
			this.elements.energy = new window.VIMQ.Info(this, window.VIMQ.Energy);
			this.elements.xpower = new window.VIMQ.Info(this, window.VIMQ.Xpower);
		}

		getSvg() {
			if (this.elements.hasOwnProperty('svg')) return this.elements.svg;
			let render = this.getRender(),
				xpower = this.getXpower(),
				energy = this.getEnergy(),
				aspace = [
					this.constructor.board(),
					this.constructor.height()
				];

			this.elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			this.elements.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			this.elements.svg.setAttribute('class', 'vimq');
			this.elements.svg.setAttribute('version', '1.1');
			this.elements.svg.setAttribute('viewBox', '0 0' + String.fromCharCode(32) + aspace.join(String.fromCharCode(32)));

			this.elements.svg.appendChild(this.getUp());
			this.elements.svg.appendChild(this.getDown());
			this.elements.svg.appendChild(xpower.out());
			this.elements.svg.appendChild(energy.out());
			this.elements.svg.appendChild(render.out());
			return this.elements.svg;
		}
		getXpower() {
			return this.elements.xpower;
		}
		getEnergy() {
			return this.elements.energy;
		}
		getRender() {
			return this.elements.render;
		}
		getUp() {
			if (this.elements.hasOwnProperty('up')) return this.elements.up;
			let y = window.VIMQ.Info.margin();
			this.elements.up = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			this.elements.up.setAttribute('d', this.constructor.grid(y));
			this.elements.up.setAttribute('style', window.VIMQ.Line.style('#000000'));
			return this.elements.up;
		}
		getDown() {
			if (this.elements.hasOwnProperty('down')) return this.elements.down;
			let y = this.constructor.height() - window.VIMQ.Info.margin();
			this.elements.down = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			this.elements.down.setAttribute('d', this.constructor.grid(y));
			this.elements.down.setAttribute('style', window.VIMQ.Line.style('#000000'));
			return this.elements.down;
		}
		out() {
			return this.getSvg();
		}
		render() {
			this.getEnergy().render();
			this.getXpower().render();
			return this;
		}
		static width() {
			return this.board() - (2 * this.margin());
		}
		static conversion(percentage) {
			let item = (percentage - this.min()) * (1e2 / (this.max() - this.min()));
			return this.margin() + (item * this.width()) / 1e2;
		}
		static clear(element) {
			while (!!element.firstChild)
				element.removeChild(element.firstChild);
		}
	}

	window.VIMQ = VIMQ;
	window.VIMQ.Info = Info;
	window.VIMQ.Render = Render;
	window.VIMQ.Line = Line;
	window.VIMQ.Xpower = Xpower;
	window.VIMQ.Energy = Energy;
	window.VIMQ.Info.Rectangle = Rectangle;
	window.VIMQ.Info.Description = Description;

})(window);
