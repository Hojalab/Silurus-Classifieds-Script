function rsSelectReplace(sel)
{
	//� ����� �� �� ���� :)
	var ie6 = (navigator.userAgent.search('MSIE 6.0') != -1);

	var ul = document.createElement('ul');
	//������ ���������� select, ���������, �� � ������
	ul.className = 'srList srCollapsed srBlur';
	
	//����� ����� ul � select
	ul.srSelect = sel;
	sel.srReplacement = ul;
	
	//������������� ��� �������� select
	//����� ������������, ��� �� �������
	sel.className += ' srReplacedSelect';

	//������ ����� �������� ul
	//��� ��������� � ������ ������
	//��������� select
	sel.onfocus = function() { this.srReplacement.className = this.srReplacement.className.replace(/[\s]?srBlur/, ' srFocus'); }

	sel.onblur = function() {
		//this.srReplacement.srCollapse();
		this.srReplacement.className = this.srReplacement.className.replace(/[\s]?srFocus/, ' srBlur');
	}
	
	//������ ������� ������ �� ������
	//������� ������������ � onchange � onkeypress
	sel.onchange = function()
	{
		var ul = this.srReplacement;
		ul.srSelectLi(ul.childNodes[this.selectedIndex]);
	}
	
	sel.onkeypress = function(e)
	{
		var i = this.selectedIndex;
		var ul = this.srReplacement;
		switch (e.keyCode) {
			case 9:
				this.srReplacement.srCollapse();
			break;

			case 37: // �����
			case 38: // �����
				if (i - 1 >= 0)
					ul.srSelectLi(ul.childNodes[i - 1]);
			break;

			case 40: // ����
				if(e.altKey)
				{
					//ul.srExpand();
					//break;
				}
			case 39: // ������

				if (i + 1 < ul.childNodes.length)
					ul.srSelectLi(ul.childNodes[i + 1]);
			break;

			case 33: // Page Up
			case 36: // Home
				ul.srSelectLi(ul.firstChild);
			break;

			case 34: // Page Down
			case 35: // End
				ul.srSelectLi(ul.lastChild);
			break;
		}
	}

	//������ ����� �������� ul
	//��� ��������� �� ���� �����
	ul.onmouseover = function() { this.className += ' srHoverUl'; }

	ul.onmouseout = function() { this.className = this.className.replace(/[\s]?srHoverUl/, ''); }

	ul.srSelectLi = function(li)
	{
		var ul = li.parentNode;

		//���� ��� ���� ��������� �������
		//�� ��������� ������� ���������
		if(ul.srSelectesIndex != null)
			ul.childNodes[ul.srSelectesIndex].className = '';

		//���������� ������ ���������� ��������
		ul.srSelectesIndex = li.srIndex;

		//������������� ��� ���������� ��������
		//����� srSelectedLi
		ul.childNodes[li.srIndex].className = 'srSelectedLi';
		return li.srIndex;
	}

	ul.srExpand = function()
	{
		if(!this.srExpanded)
		{
			if(document.srExpandedList)
				document.srExpandedList.srCollapse();

			document.srExpandedList = this;

			//������������� ������
			this.className  = this.className.replace(/[\s]?srCollapsed/, ' srExpanded');
			this.srExpanded = true;
			
			//��� ��������� �������� �������� �����
			//���������������� select
			this.srSelect.focus();

			//��� ����� ���������� ��������
			//������������� ������ ��������� ��������
			if(ie6) 
			{
				var node = this.firstChild;
				var offset = 0;
				var height = node.clientHeight;
				while(node)
				{
					node.style.position = 'absolute';
					node.style.top = offset;
					offset += height; 
					node = node.nextSibling;
				}
			}
		}
	}

	ul.srCollapse = function(li)
	{	
		if(this.srExpanded)
		{
			document.srExpandedList = null;

			//�������� ������� ������ �� ������� ������� ������������
			//� ������������� �������������� ������ ���������� ��������
			//��� ����������� �������� select
			if(li)
				this.srSelect.selectedIndex = this.srSelectLi(li);
			
			//��� ����� �� �������� ������
			//��������������� ���������� select
			//������ ����� ����� ������� �� �����
			this.srSelect.focus();

			//����������� ������
			this.className = this.className.replace(/[\s]?srExpanded/, ' srCollapsed');
			this.srExpanded = false;

			//��� ����� ���������� ��������
			//���������� ������ ��������� ��������
			if(ie6)
			{
				var node = this.firstChild;
				while(node)
				{
					node.style.position = '';
					node = node.nextSibling;
				}
			}
		}
	}


	var options = sel.options;
	var len = options.length;

	for(var i = 0; i < len; i++)
	{
		//��� ������� �������� option
		//������� �������������� li
	    var li = document.createElement('li');
		li.appendChild(document.createTextNode(options[i].text));

		//� ������ �������� ������
		//������ ������ ����������������
		//�������� option
		li.srIndex = i;

		//������ ����� hover � IE �������� ������ ��� ������
		//������� ����� ������ ����� ��� ��������� �����
		li.onmouseover = function() { this.className += ' srHoverLi'; }

		li.onmouseout = function() { this.className = this.className.replace(/[\s]?srHoverLi/, ''); }

		ul.appendChild(li);
	}
	
	//���� �� ��������� �� ������ ������� �������
	//�������� ������
	if(sel.selectedIndex == null)
		sel.selectedIndex = 0;

	//������������� ������� ��������� �� ���������
	ul.srSelectLi(ul.childNodes[sel.selectedIndex]);

	//��������� ��������� ������
	//����� ���������� select
	sel.parentNode.insertBefore(ul, sel);
}

function srAddEvent(obj, type, fn)
{ 
	// ������� ��������� ���������� �������
	if (obj.addEventListener)
		obj.addEventListener(type, fn, false);
	else if (obj.attachEvent)
		obj.attachEvent( "on"+type, fn );
}

function srOnDocumentClick(e)
{
	var target = (window.event) ? window.event.srcElement : e.target;

	if(document.srExpandedList)
	{
		//����������� �� ��������������� li ������ ���������� select
		if((target.srIndex || target.srIndex === 0)
			//����������� �� ��� li ��������� � ������ ������ ������
			&& document.srExpandedList == target.parentNode	)
			document.srExpandedList.srCollapse(target);
		else
			document.srExpandedList.srCollapse();
	}
	else
	{
		if(target.srIndex || target.srIndex === 0)
			target.parentNode.srExpand();
	}
}


function srReplaceSelects()
{
	//�������� ��� �������� select
	/*var s = document.getElementsById('select');
	var len = s.length
	for (var i = 0; i < len; i++)
		rsSelectReplace(s[i]);*/
		
	var s = document.getElementById('selectid');
	rsSelectReplace(s);
	srAddEvent(document, 'click', srOnDocumentClick);
}

//��� �������� ���������� ����������
//�������� ��� ������� �����
//����� �������� DOM �� ������ �����������
//���� ����� �����������, ��������, � jQuery
//��� ����� ������� ���:
//$(document).ready(rsReplaceSelects);
srAddEvent(window, 'load', srReplaceSelects);

