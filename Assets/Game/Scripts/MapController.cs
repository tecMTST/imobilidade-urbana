using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MapController : MonoBehaviour
{

    public RectTransform[] mapWagons;
    public RectTransform playerMapIcon;



    // Start is called before the first frame update
    void Start(){
        
    }

    // Update is called once per frame
    void Update(){
        
    }

    public void RevealMap(int index){
        mapWagons[index].GetComponent<Image>().color = Color.white;
    }

    public void SetPlayerMapPosition(int index){
        playerMapIcon.SetParent(mapWagons[index], false);
    }
}
