#include <WaspSensorSW.h>
#include <WaspWIFI_PRO.h>
// Calibration values

#define cal_point_10  2.070
#define cal_point_7   2.132
#define cal_point_4   2.181
// Temperature at which calibration was carried out
#define cal_temp 28.7
// Offset obtained from sensor calibration
//#define calibration_offset 0.0
// Calibration of the sensor in normal air
//#define air_calibration 2.65
// Calibration of the sensor under 0% solution
//#define zero_calibration 0.0
// Value 1 used to calibrate the sensor
//#define point1_cond 10500
// Value 2 used to calibrate the sensor
//#define point2_cond 40000
// Point 1 of the calibration
//#define point1_cal 197.00
// Point 2 of the calibration
//#define point2_cal 150.00

//======================= WiFi AP settings (CHANGE TO USER'S AP)======================
// choose socket
uint8_t socket = SOCKET0;
char ESSID[] = "minhtai";
char PASSW[] = "123456780";

char type[] = "http";
//char host[] = "server-smart-water.herokuapp.com";
char host[] = "192.168.43.210";
//char port[] = "80";
char port[] = "4002";
char url[]  = "api/device/pushdata?";
////////////////Variable-sensors-read////////////////

float value_temp; char temp_string[6];

float value_pH; char ph_string[6];
//
//float value_orp = 96.69; char orp_string[8];
//
//float value_do = 66.99; char do_string[6];
//
//float value_cond = 34.63; char cond_string[6];

uint8_t battery = 0;

/////////Sensors-Class//////////////

pt1000Class TemperatureSensor;
pHClass pHSensor;
//ORPClass ORPSensor;
//DOClass DOSensor;
//conductivityClass ConductivitySensor;



// define variables-system
char filename[] = "FILE1.TXT";
uint8_t sd_answer;
int32_t number_line;
char *line[50];
uint8_t count_not_send = 0;
uint8_t i;
uint8_t error;
unsigned long previous;
char body[255];
char bodysend[350];



//=======================WIFI Config=====================================
void configWifi()
{
  USB.println(F("****************Wifi-Config****************\n"));
  // 1. Switch ON the WiFi module
  error = WIFI_PRO.ON(socket);

  if (error == 0)
  {
    USB.println(F("1. WiFi switched ON"));
  }
  else
  {
    USB.println(F("1. WiFi did not initialize correctly"));
  }

  // 2. Reset to default values

  error = WIFI_PRO.resetValues();

  if (error == 0)
  {
    USB.println(F("2. WiFi reset to default"));
  }
  else
  {
    USB.println(F("2. WiFi reset to default ERROR"));
  }

  // 3. Set ESSID

  error = WIFI_PRO.setESSID(ESSID);

  if (error == 0)
  {
    USB.println(F("3. WiFi set ESSID OK"));
  }
  else
  {
    USB.println(F("3. WiFi set ESSID ERROR"));
  }

  // 4. Set password key (It takes a while to generate the key)

  error = WIFI_PRO.setPassword(WPA2, PASSW);

  if (error == 0)
  {
    USB.println(F("4. WiFi set AUTHKEY OK"));
  }
  else
  {
    USB.println(F("4. WiFi set AUTHKEY ERROR"));
  }

  // 5. Software Reset
  error = WIFI_PRO.softReset();

  if (error == 0)
  {
    USB.println(F("5. WiFi softReset OK"));
  }
  else
  {
    USB.println(F("5. WiFi softReset ERROR"));
  }


  //  6.Set URL
  error = WIFI_PRO.setURL( type, host, port, url );

  if (error == 0)
  {
    USB.println(F("2. setURL OK"));
  } else
  {
    USB.println(F("2. Error calling 'setURL' function"));
    WIFI_PRO.printErrorCode();
  }



  USB.println(F("****************Finished-Wifi-Config****************\n"));
}


void setup()
{
  //config the calibration values
  pHSensor.setCalibrationPoints(cal_point_10, cal_point_7, cal_point_4, cal_temp);
  //DOSensor.setCalibrationPoints(air_calibration, zero_calibration);
  //ConductivitySensor.setCalibrationPoints(point1_cond, point1_cal, point2_cond, point2_cal);

  //power on SW
  Water.ON();
  SD.ON();
  RTC.ON();
  //RTC.setGMT(7);
  configWifi();
  //wait the Smart Water stability
  delay(2000);
  // get current time
  previous = millis();
}


void loop()
{

  //========================== Read sensors===================================================

  // Read the temperature sensor
  value_temp = TemperatureSensor.readTemperature();

  //  // Read the ph sensor
    value_pH = pHSensor.readpH();
  //  // Convert the value read with the information obtained in calibration
    value_pH = pHSensor.pHConversion(value_pH,value_temp);
  //
  //  // Reading of the ORP sensor
  //  value_orp = ORPSensor.readORP();
  //  // Apply the calibration offset
  //  value_orp = value_orp - calibration_offset;
  //
  //  // Reading of the DO sensor
  //  value_do = DOSensor.readDO();
  //  // Conversion from volts into dissolved oxygen percentage
  //  value_do = DOSensor.DOConversion(value_do);
  //
  //  // Reading of the Conductivity sensor
  //  value_cond = ConductivitySensor.readConductivity();
  //  // Conversion from resistance into ms/cm
  //  value_cond = ConductivitySensor.conductivityConversion(value_cond);

  battery = PWR.getBatteryLevel();
  //=========================================Convert float to string and create body=========================================

  Utils.float2String(value_temp, temp_string, 2);
  Utils.float2String(value_pH, ph_string, 2);
//  Utils.float2String(value_orp, orp_string, 2);
//  Utils.float2String(value_do, do_string, 2);
//  Utils.float2String(value_cond, cond_string, 2);

  //create body

  /*snprintf(body, 90, "token=%s&temp=%s&ph=%s&orp=%s&do=%s&co=%s&bat=%d&timestamp=%ld\n",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZCI6IlBxM2phZ1RTZ3VSR3BoeFNtb0pvNSIsImlhdCI6MTU5MjM3ODc1N30.dzvOmaywjqaudzgsd34S_6CvLkSukHjH7tOa_EY5A70",
  temp_string, ph_string, orp_string, do_string, cond_string, battery, RTC.getEpochTime());*/
  snprintf(body, 245, "token=%s&ID=%s&temperature=%s&ph=%s&battery=%d&timestamp=%ld\n",
  "eyJhbGciOiJIUzI1NiJ9.N2ZkYzE5M2ZmMjRkNjg1M2I1NzM.WbxoVIVGnbF-cOPU2AdMq0BIn8pbD7FJVsZ4_gpv6UE","Je1Y4NuqNspz7yTMIRHK",temp_string,ph_string,battery,RTC.getEpochTime());
  
  
  USB.println(body);

  //==================================================SEND DATA===========================================================================


  if (WIFI_PRO.isConnected() == true)
  {
    USB.println(F("Co ket noi wifi"));
    count_not_send = 0;
    number_line = SD.numln(filename);
    if (number_line != 0 )
    {
      USB.print(F("file co du lieu "));
      USB.println(number_line);
      SD.showFile(filename);
      for (i = 0; i < number_line ; i++)
      {
        USB.println(F("------------READ Line-----------------"));
        SD.catln(filename, i, 1);
        USB.println( SD.buffer );
        error = WIFI_PRO.post(SD.buffer);

        if (error == 0)
        {
          USB.print(F("3.1. HTTP POST OK. "));
          USB.print(F("HTTP Time from OFF state (ms):"));
          USB.println(millis() - previous);
        }
        else
        {
          USB.println(F("Loi gui http"));
          USB.println(F("Them vao line"));
          line[count_not_send] = (char*)malloc(90 * sizeof(char));
          strcpy(line[count_not_send++], SD.buffer);
        }
        USB.println(F("----------- END-----------------"));
      }
    }

    USB.println(F("Gui Du lieu moi doc"));
    error = WIFI_PRO.post(body);
    if (error == 0)
    {
      USB.print(F("3.1. HTTP POST OK. "));
      USB.print(F("HTTP Time from OFF state (ms):"));
      USB.println(millis() - previous);
    }
    else
    {
      USB.println(F("Loi gui http NEW"));
      USB.println(F("Them vao line"));
      line[count_not_send] = (char*)malloc(90 * sizeof(char));
      strcpy(line[count_not_send++], body);
    }

    USB.println(F("Xoa File"));
    sd_answer = SD.del(filename);

    if ( sd_answer == 1 )
    {
      USB.println(F("file deleted"));
    }
    else
    {
      USB.println(F("file NOT deleted"));
    }

    USB.println(F("Tao lai file"));
    sd_answer = SD.create(filename);

    if ( sd_answer == 1 )
    {
      USB.println(F("file created"));
    }
    else
    {
      USB.println(F("file NOT created"));
    }

    USB.println(F("neu co line loi them vao file"));
    if (count_not_send != 0)
    {
      USB.print(F("Da co loi so loi la :"));
      USB.println(count_not_send, DEC);
      USB.println(F("Start append in file"));
      for (i = 0; i < count_not_send ; i++)
      {
        SD.append(filename, line[i]);
        free(line[i]);
      }
      USB.println(F("Done"));
    }
  }
  else
  {
    USB.print(F("WiFi is connected ERROR"));
    USB.print(F(" Time(ms):"));
    USB.println(millis() - previous);
    USB.println(F("Them vao cuoi file"));
    SD.append(filename, body);
  }




  //===============================ENTER DEEP SLEEP MODE===================================
  USB.println(F("enter deep sleep"));
  // Go to sleep disconnecting all switches and modules
  // After 15 Min, Waspmote wakes up thanks to the RTC Alarm
  PWR.deepSleep("00:00:00:05:00", RTC_OFFSET, RTC_ALM1_MODE1, ALL_OFF);
  
  
  
  
  
  
 
  USB.println(F("\nwake up"));

  USB.ON();
  RTC.ON();
  SD.ON();
  Water.ON();
  error = WIFI_PRO.ON(socket);

  if (error == 0)
  {
    USB.println(F("1. WiFi switched ON"));
  }
  else
  {
    USB.println(F("1. WiFi did not initialize correctly"));
  }



  // After wake up check interruption sourc
  if ( intFlag & RTC_INT )
  {
    // clear interruption flag
    intFlag &= ~(RTC_INT);

    USB.println(F("---------------------"));
    USB.println(F("RTC INT captured"));
    USB.println(F("---------------------"));
  }

  // get current time
  previous = millis();
}
