using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManagement : MonoBehaviour{

    public static GameManagement Instance;

    private PlayerController playerController;
    private Vector3 playerInitialPosition;
    

    private void Awake() {
        DontDestroyOnLoad(this.gameObject);

        Instance = this;
    }

    // Start is called before the first frame update
    void Start(){
        playerController = PlayerController.Instance;
        playerInitialPosition = playerController.transform.position;
    }

    // Update is called once per frame
    void Update(){
        
    }


    /// <summary>
    /// Sets the player position in the wolrd scene
    /// </summary>
    /// <param name="position">The desired position. Initial position by default</param>
    public void SetPlayerPosition(Vector3 position = new Vector3()) {

        if (position == new Vector3(0, 0, 0)) {
            playerController.transform.position = playerInitialPosition;
            return;
        }

        playerController.transform.position = position;

    }
}
