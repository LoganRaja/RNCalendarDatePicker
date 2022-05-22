import React, { Component } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default class CalendarDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      modalVisible: false,
      activeDate: new Date(),
      toDay: new Date(),
      selectedDates: this.props.selectedDates ?? [],
      firstDate: '',
      lastDate: '',
      multiSelect: this.props.multiSelect ? this.props.multiSelect : false,
      yearPickerVis: false,
      checkbefToday: this.props.checkbefToday ?? false,
      maxNumOfDateSel: this.props.maxNumOfDateSel ?? -1,
    };
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  handleShow() {
    this.setState({ modalVisible: true, });
  }

  handleClose() {
    this.setState({ modalVisible: false });
  }

  generateMatrix = date => {
    let matrix = [],
      year = date.getFullYear(),
      month = date.getMonth();
    let firstDay = new Date(year, month, 1).getDay();
    let maxDays = new Date(year, month + 1, 0).getDate();
    let counter = 1;

    for (let row = 0; row < 6; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if ((row == 0 && col >= firstDay) || (row > 0 && counter <= maxDays)) {
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  };

  getSelectedItems = () => {
    this.props.getSelectedDates(this.state.selectedDates);
    this.handleClose();
  };

  datePress = (item, beforeToday) => {
    let limitCheck = this.state.maxNumOfDateSel == -1 ? true :
      this.state.selectedDates.length < this.state.maxNumOfDateSel ? true : false;
    console.log(limitCheck, this.state.maxNumOfDateSel, this.state.selectedDates.length)
    if (item != -1 && limitCheck) {
      if ((beforeToday != 100 || !this.state.checkbefToday) && (item >= beforeToday
        || beforeToday == -1 || !this.state.checkbefToday)) {
        let tempArr = this.props.multiSelect ? this.state.selectedDates : [];
        let year = this.state.activeDate.getFullYear(),
          month = this.state.activeDate.getMonth() + 1;
        let date =
          ('0' + item).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year;
        tempArr.push(date);
        this.setState({ selectedDates: tempArr }, () => {
          //this.props.getSelectedDates(this.state.selectedDates);
          //this.handleClose();
        });
      }
    }

  };


  changeMonth = n => {
    this.setState(() => {
      this.state.activeDate.setMonth(this.state.activeDate.getMonth() + n);
      return this.state;
    });
  };


  //Create Header
  renderDays = () => {
    return (
      <View style={style.headerStyle}>
        {this.weekDays.map((item, index) => (
          <Text style={style.textHeader} key={'key' + item}>
            {item}
          </Text>
        ))}
      </View>
    );
  };

  isSelectedDate = item => {
    let year = this.state.activeDate.getFullYear(),
      month = this.state.activeDate.getMonth() + 1;
    item = ('0' + item).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year;
    return this.state.selectedDates.includes(item);
  };

  checkBeforeToday = () => {
    //before 100, after -1,same month 1
    let { toDay, activeDate } = this.state;
    if (activeDate.getFullYear() < toDay.getFullYear()) return 100;
    else if (activeDate.getFullYear() > toDay.getFullYear()) return -1;
    else if (activeDate.getFullYear() == activeDate.getFullYear()) {
      if (activeDate.getMonth() < toDay.getMonth()) return 100;
      else if (activeDate.getMonth() > toDay.getMonth()) return -1;
      else return toDay.getDate();
    }
  };

  dateTextColor = (item, beforeToday) => {
    if (
      (this.state.checkbefToday && (beforeToday == 100 ||
        beforeToday > item))
    )
      return '#cacaca';
    else if (this.isSelectedDate(item)) return 'white';
    else return 'black';
  };


  renderDates = () => {
    let matrix = this.generateMatrix(this.state.activeDate);
    let beforeToday = this.checkBeforeToday();
    return matrix.map((row, rowIndex) => (
      <View
        style={[style.headerStyle, { backgroundColor: 'white' }]}
        key={'key' + rowIndex}>
        {row.map((item, colIndex) => (
          <View style={{ flex: 1 }} key={'key' + colIndex}>
            <TouchableOpacity
              style={[
                style.viewDate,
                {
                  backgroundColor: this.isSelectedDate(item)
                    ? '#4CAAD8'
                    : 'white',
                },
              ]}
              onPress={() => this.datePress(item, beforeToday)}>
              <Text
                style={{
                  fontSize: 15,
                  color: this.dateTextColor(item, beforeToday),
                }}>
                {item != -1 ? item : ''}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    ));
  };

  setYear = (year) => {
    this.setState(() => {
      this.state.activeDate.setFullYear(year);
      return this.state;
    });
  }

  setMonth = (month) => {
    this.setState(() => {
      this.state.activeDate.setMonth(month);
      return this.state;
    });
  }


  renderYear = () => {
    let firstYear = this.state.toDay.getFullYear() - 50;
    let lastYear = this.state.toDay.getFullYear() + 50;
    let array = [];
    for (let i = firstYear; i < lastYear; i++) {
      array.push(<Picker.Item
        label={i + ''}
        value={i + ''}
        key={i + 'key'}
      />)
    }
    return (array)
  }

  renderMonth = () => {
    return this.months.map((obj, index) => (
      <Picker.Item
        label={obj}
        value={index}
        key={index + 'key'}
      />
    ));
  }
  renderYearPicker = () => {
    let selectedYear = this.state.activeDate.getFullYear();
    let selectedMonth = this.state.activeDate.getMonth();
    return (
      <Modal
        transparent={true}
        visible={this.state.yearPickerVis}
      >

        <View style={style.rootView}>
          <View style={style.topView}>
            <View style={{ flexDirection: 'row' }}>
              <Picker selectedValue={selectedMonth}
                onValueChange={(itemValue, itemIndex) =>
                  this.setMonth(itemValue)
                }
                style={{ flex: 1 }}>
                {this.renderMonth()}
              </Picker>
              <Picker selectedValue={selectedYear + ''}
                onValueChange={(itemValue, itemIndex) =>
                  this.setYear(itemValue)
                }
                style={{ flex: 1 }}>
                {this.renderYear()}
              </Picker>
            </View>
            <View style={style.bottomView}>
              <Text
                style={style.button}
                onPress={() => this.setState({ yearPickerVis: false })}>
                OK
              </Text>
            </View>
          </View>
        </View>

      </Modal>
    )

  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.handleClose();
        }}>
        <View style={style.rootView}>
          <View style={style.topView}>
            <View style={style.viewTitle}>
              <TouchableOpacity
                activeOpacity={1}
                style={{ paddingHorizontal: 25 }}
                onPress={() => this.changeMonth(-1)}>
                <Text style={{ fontSize: 20, color: 'white' }}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={[style.textTitle, { flex: 1 }]} onPress={() => this.setState({ yearPickerVis: true })
                //console.log('slkdjsfd;klj')
              }>
                {this.months[this.state.activeDate.getMonth()]} &nbsp;
                {this.state.activeDate.getFullYear()}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={{ paddingHorizontal: 25 }}
                onPress={() => this.changeMonth(+1)}>
                <Text style={{ fontSize: 20, color: 'white' }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            {this.renderDays()}
            {this.renderDates()}
            {this.renderYearPicker()}
            <View style={style.bottomView}>
              {this.state.multiSelect ? <Text
                onPress={() => this.setState({ selectedDates: [] })}
                style={[style.button, { marginRight: 10 }]}>
                CLEAR
              </Text> : null}
              <Text
                onPress={() => this.handleClose()}
                style={[style.button, { marginRight: 10 }]}>
                CANCEL
              </Text>
              <Text
                style={style.button}
                onPress={() => this.getSelectedItems()}>
                OK
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
const style = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  rootView: {
    flex: 1,
    backgroundColor: '#34343470',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topView: {
    backgroundColor: 'white',
    maxHeight: '90%',
    width: '90%',
  },
  textHeader: {
    flex: 1,
    fontSize: 15,
    color: '#08016A',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  viewDate: {
    height: 35,
    width: 35,
    margin: 3,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#08016A',
    paddingVertical: 15,
  },
  textTitle: {
    fontSize: 18,
    paddingHorizontal: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  viewAvail: {
    height: 2,
    width: 10,
    backgroundColor: '#ffae00',
    marginBottom: 2,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingTop: 5,
    paddingRight: 15,
    paddingLeft: 15,
  },
  button: {
    padding: 10,
    backgroundColor: '#08016A',
    color: 'white',
    overflow: 'hidden',
    borderRadius: 5,
  }
});
